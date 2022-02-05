import { join } from 'node:path';
import scrape from 'website-scraper';

// currently using a forked version of website-scraper since website-scraper doesn't export plugins correctly for use with ts :(
import { GenerateFilenameBySiteStructurePlugin } from 'website-scraper/lib/plugins';

import { loadConfig } from '../config.js';
import { start as startServer } from '../index.js';

import { getFreePort } from '../utils/free-port.js';
import { outputFile } from '../utils/output';

import { loadRoutes, SnowstormCustomRouteInternal } from '../router/routes.js';
import { loadPages } from '../router/pages.js';
import { cp } from 'node:fs/promises';
import { stripFileExtensions } from '../utils/strip-file-extension.js';

export const exportProject = async ({
	path,
	debug,
}: {
	path: string;
	debug?: boolean;
}) => {
	const buildStart = performance.now();
	const config = await loadConfig(path);
	const { log } = config.internal;

	const sites = await Promise.all(
		config.internal.sites.map(async site => {
			const pages = await loadPages(site.internal.pagesFolder);
			const routes = await loadRoutes(stripFileExtensions(pages), site);
			return { site, routes, paths: await calculatePaths(routes) };
		}),
	);

	config.production.port = await getFreePort();
	await startServer({ dev: false, path, overrideConfig: config, debug }).catch(
		e => log.error('failed to start server', e),
	);

	const directory = join(config.internal.rootFolder, config.export.outDir);

	const urls: string[] = [];
	const copy = [];
	const multisite = !(sites.length === 1 && sites[0].site.domain === 'default');
	for (const { site, paths } of sites) {
		let dir = directory;
		if (multisite) {
			dir = join(dir, site.domain);
		}

		copy.push(
			cp(join(site.internal.viteFolder, '/client'), dir, {
				recursive: true,
				dereference: false,
			}),
		);

		const url = `http://${
			site.domain === 'default' ? '' : site.domain + '.'
		}localhost:${config.production.port}`;
		urls.push(...paths.map(path => url + path));
	}

	log.info('copying build results...');
	// this will often throw irrelevant errors
	void (await Promise.all(copy).catch(_e => undefined));

	log.info('rendering pages...');
	const renderStart = performance.now();
	await scrape({
		urls,
		directory,
		filenameGenerator: '',
		defaultFilename: 'index.html',
		request: {
			headers: {
				Accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
			},
		},
		plugins: [new SnowstormScrapePlugin({ multisite })],
	}).catch(e => log.error('failed to scrape files', e));

	const now = performance.now();
	log.info(
		`finished export in ${Math.round(now - buildStart)}ms (build: ${Math.round(
			renderStart - buildStart,
		)}ms render: ${Math.round(now - renderStart)}ms)`,
	);

	process.exit(0);
};

class SnowstormScrapePlugin {
	multisite: boolean;
	constructor({ multisite }: { multisite: boolean }) {
		this.multisite = multisite;
	}

	apply = (
		registerAction: (arg1: string, arg2: (arg1: any) => any) => void,
	) => {
		let absoluteDirectoryPath: string;
		const loadedResources = [];

		registerAction('beforeStart', ({ options }) => {
			absoluteDirectoryPath = options.directory;
		});

		new GenerateFilenameBySiteStructurePlugin().apply(registerAction);

		registerAction('saveResource', async ({ resource }) => {
			const parts = (resource.getFilename() as string).split('/');
			const filename = join(
				absoluteDirectoryPath,
				(this.multisite
					? [
							parts[0].replace(/\.?localhost_[0-9]{4,6}/, '') || 'default',
							...parts.slice(1),
					  ]
					: parts.slice(1)
				).join('/'),
			);

			const text = resource.getText();
			if (text.length) await outputFile(filename, text, { encoding: 'binary' });
			loadedResources.push(resource);
		});
	};
}

const calculatePaths = async (
	routes: SnowstormCustomRouteInternal[],
): Promise<string[]> =>
	(
		await Promise.all(
			routes.map(async route => {
				const dynamicParams = route.parts?.filter(p => p.startsWith(':'));
				const exportParams =
					(route.exportParams && (await route.exportParams())) ?? [];

				if (dynamicParams?.length) {
					if (!exportParams) return Promise.resolve([]);

					const paths = [];
					for (const param of exportParams) {
						if (param.length !== dynamicParams.length)
							return Promise.reject(
								new Error(
									`exportParam mismatch: ${route.path}: have ${param.length}, want ${dynamicParams.length}`,
								),
							);

						paths.push(
							dynamicParams.reduce(
								(prev, cur, i) => prev?.replace(cur, param[i]),
								route.path,
							),
						);
					}

					return Promise.resolve(paths);
				}

				return Promise.resolve([route.path]);
			}),
		)
	)
		.flat()
		.filter(isString);

function isString(x: unknown): x is string {
	return typeof x === 'string';
}
