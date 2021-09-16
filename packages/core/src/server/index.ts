import { performance } from 'perf_hooks';

import Koa from 'koa';
import mount from 'koa-mount';

import { loadConfig } from './config.js';
import { SnowstormConfigInternal } from './config';
import { startSite } from './site.js';

import pkg from './../package.json';

process.setMaxListeners(10000);

export const start = async ({
	dev,
	path,
	clearCache,
	overrideConfig,
}: {
	dev: boolean;
	path: string;
	clearCache?: boolean;
	overrideConfig?: SnowstormConfigInternal;
}) => {
	const config = overrideConfig ? overrideConfig : await loadConfig(path);
	const { log } = config.internal;

	log.info(
		`starting snowstorm v${pkg.version as string}${
			(dev && ' (development mode)') || ''
		}`,
	);

	if (clearCache) {
		log.error('TODO: not supportet');
	}

	const serverStart = performance.now();
	const server = new Koa();

	const startSites = await Promise.all(
		config.internal.sites.map(async site =>
			startSite({ dev, config, site }).then(app => ({
				site,
				app,
			})),
		),
	);

	const defaultSite = startSites.find(site => site.site.domain === 'default');

	server.use((ctx, next) => {
		const site = startSites.find(site =>
			ctx.hostname.startsWith(site.site.domain),
		);

		if (site) return mount(site.app)(ctx, next);
		if (defaultSite) return mount(defaultSite.app)(ctx, next);
	});

	const port = dev ? config.development.port : config.production.port;

	const listening = new Promise<void>(resolve => {
		server.listen(port, () => resolve());

		startSites.forEach(({ site }) => {
			if (site.domain === 'default')
				return site.internal.log.info(
					`listening on http://localhost:${port}${site.basePath}`,
				);
			site.internal.log.info(
				`listening on http://${site.domain}.localhost:${port}${site.basePath}`,
			);
		});
	});

	log.info(`started in ${Math.round(performance.now() - serverStart)}ms`);
	await listening;
};
