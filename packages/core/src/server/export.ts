import { loadConfig } from './config';
import { getFreePort } from './utils/free-port';
import { loadNormalizedPages } from './router/pages';
import { loadRoutes, SnowstormCustomRouteInternal } from './router/routes';
import { start as startServer } from './';
import { join } from 'path';
import { outputFile } from 'fs-extra';

import scrape from 'website-scraper';

export const exportProject = async ({ path }: { path: string }) => {
	const config = await loadConfig(path);
	const { log } = config.internal;

	const sites = await Promise.all(
		config.internal.sites.map(async site => {
			const normalizedPages = await loadNormalizedPages(
				site.internal.pagesFolder,
			);

			const routes = await loadRoutes(normalizedPages, site);
			return { site, routes, paths: await calculatePaths(routes) };
		}),
	);

	config.production.port = await getFreePort();
	await startServer({ dev: false, path, overrideConfig: config });

	const urls: string[] = [];
	for (const { site, paths } of sites) {
		const url = `http://${
			site.domain === 'default' ? '' : site.domain + '.'
		}localhost:${config.production.port}`;
		urls.push(...paths.map(path => url + path));
	}

	const directory = join(config.internal.rootFolder, config.export.outDir);

	log.info('rendering pages...');
	const renderStart = performance.now();
	await scrape({
		urls,
		directory,
		filenameGenerator: 'bySiteStructure',
		plugins: [
			new SnowstormScrapePlugin({ multisite: sites.length > 1 || undefined }),
		],
	});
	log.info(
		`finished rendering in ${Math.round(performance.now() - renderStart)}ms`,
	);

	process.exit(0);
};

class SnowstormScrapePlugin {
	multisite?: true;
	constructor({ multisite }: { multisite?: true }) {
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
			await outputFile(filename, text, { encoding: 'binary' });

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
