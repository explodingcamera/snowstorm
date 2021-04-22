import { logger, clearCache } from 'snowpack';
import { performance } from 'perf_hooks';

import Koa from 'koa';
import mount from 'koa-mount';

import { loadConfig, SnowstormInternalSiteConfig } from './config.js';
import { SnowstormConfigInternal } from './config';
import { startSite } from './site.js';

logger.level = 'silent';
logger.on('error', e => console.error(e));
logger.on('warn', e => console.error(e));
logger.on('info', e => console.error(e));
logger.on('debug', e => console.error(e));

export const start = async ({
	dev,
	path,
	clearSnowpackCache,
	overrideConfig,
}: {
	dev: boolean;
	path: string;
	clearSnowpackCache?: boolean;
	overrideConfig?: SnowstormConfigInternal;
}) => {
	if (clearSnowpackCache) await clearCache();
	console.log('>> successfully cleared the cache');

	const serverStart = performance.now();
	const config = overrideConfig ? overrideConfig : await loadConfig(path);
	const server = new Koa();

	const startSites = config.internal.sites.map(async site =>
		startSite(dev, config, site),
	);

	for await (const siteApp of startSites) {
		server.use(mount(siteApp));
	}

	const port = dev ? config.development.port : config.production.port;

	const listening = new Promise<void>(resolve => {
		server.listen(port, () => resolve());

		config.internal.sites.forEach(site => {
			if (site.domain === '*')
				return console.log(
					`>> listening on http://localhost:${port}${site.basePath}`,
				);
			console.log(
				`>> listening on http://${site.domain}.localhost:${port}${site.basePath}`,
			);
		});
	});

	console.log(`>> started in ${Math.round(performance.now() - serverStart)}ms`);
	await listening;
};
