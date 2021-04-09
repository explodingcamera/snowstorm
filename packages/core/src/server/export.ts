import { loadConfig } from './config';
import { generate } from 'staticgen-node';
import { getFreePort } from './utils/free-port';
import { loadNormalizedPages } from './router/pages';
import { loadRoutes } from './router/routes';

export const exportProject = async ({ path }: { path: string }) => {
	const config = await loadConfig(path);

	const normalizedPages = await loadNormalizedPages(
		config.internal.pagesFolder,
	);
	const routes = await loadRoutes(config.internal.projectPath, normalizedPages);

	console.log(routes);

	config.server.port = await getFreePort();
	const port = config.server.port;

	generate({
		pages: [],
		chdir: config.internal.projectPath,
		directory: config.export.outDir,
		url: `localhost:${port}`,
	});
};
