import { loadConfig } from './config';
import { generate } from 'staticgen-node';
import { getFreePort } from './utils/free-port';
import { loadNormalizedPages } from './router/pages';
import { loadRoutes, SnowstormCustomRouteInternal } from './router/routes';
import { start as startServer } from './';
import { join } from 'path';

export const exportProject = async ({ path }: { path: string }) => {
	const config = await loadConfig(path);

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

	for (const { site, paths } of sites) {
		// We need to refactor this; starting with how the config is handled this should be figured out there
		const directory =
			sites.length === 1
				? join(config.internal.rootFolder, site.export.outDir)
				: join(
						config.site.export?.outDir ||
							join(config.internal.rootFolder, './out'),
						site.export.outDir || site.internal.name,
				  );

		generate({
			pages: paths,
			directory,
			url: `http://${site.domain === 'default' ? '' : site.domain}.localhost:${
				config.production.port
			}`,
		});
	}
};

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
