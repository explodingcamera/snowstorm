import { join } from 'path';
import scrape from 'website-scraper';
import bySiteStructureFilenameGenerator from 'website-scraper/lib/filename-generator/by-site-structure.js';

import { loadConfig } from './config.js';
import { start as startServer } from './index.js';

import { getFreePort } from './utils/free-port.js';
import { outputFile } from './utils/output';

import { loadRoutes, SnowstormCustomRouteInternal } from './router/routes.js';
import { loadNormalizedPages } from './router/pages.js';

export const exportProject = async ({
	path,
	debug,
}: {
	path: string;
	debug?: boolean;
}) => {
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
	await startServer({ dev: false, path, overrideConfig: config, debug });

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
		filenameGenerator: '',
		request: {
			headers: {
				Accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
			},
		},
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

		registerAction('generateFilename', ({ resource }) => {
			const filename = bySiteStructureFilenameGenerator(resource, {
				defaultFilename: 'index.html',
			});
			return { filename };
		});

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
			console.log('created ', filename);

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
