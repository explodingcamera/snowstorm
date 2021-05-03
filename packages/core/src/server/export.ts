import { loadConfig } from './config';
import { generate } from 'staticgen-node';
import { getFreePort } from './utils/free-port';
import { loadNormalizedPages } from './router/pages';
import { loadRoutes } from './router/routes';
import { start as startServer } from './';

export const exportProject = async ({ path }: { path: string }) => {
	const config = await loadConfig(path);

	// TODO: multisite mode
	// const normalizedPages = await loadNormalizedPages(
	// 	config.internal.pagesFolder,
	// );
	// const routes = await loadRoutes(config.internal.projectPath, normalizedPages);

	// const paths = (
	// 	await Promise.all(
	// 		routes.map(async route => {
	// 			const dynamicParams = route.parts?.filter(p => p.startsWith(':'));
	// 			const exportParams =
	// 				(route.exportParams && (await route.exportParams())) ?? [];

	// 			if (dynamicParams?.length) {
	// 				if (!exportParams) return Promise.resolve([]);

	// 				const paths = [];
	// 				for (const param of exportParams) {
	// 					if (param.length !== dynamicParams.length)
	// 						return Promise.reject(
	// 							new Error(
	// 								`exportParam mismatch: ${route.path}: have ${param.length}, want ${dynamicParams.length}`,
	// 							),
	// 						);

	// 					paths.push(
	// 						dynamicParams.reduce(
	// 							(prev, cur, i) => prev.replace(cur, param[i]),
	// 							route.path,
	// 						),
	// 					);
	// 				}

	// 				return Promise.resolve(paths);
	// 			}

	// 			return Promise.resolve([route.path]);
	// 		}),
	// 	)
	// ).flat();

	// config.server.port = await getFreePort();
	// await startServer({ dev: false, path, overrideConfig: config });

	// generate({
	// 	pages: ['test', 'pog'],
	// 	directory: config.export.outDir,
	// 	url: `http://localhost:${config.server.port}`,
	// });
};
