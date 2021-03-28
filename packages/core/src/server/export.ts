import { calculateRoutes } from '../client/router/shared';
import { loadConfig } from './config';
import { loadNormalizedRoutes } from './routes';

export const exportProject = async (path: string) => {
	const config = await loadConfig(path);
	const routes = await loadNormalizedRoutes(config.internal.pagesFolder);

	console.log(routes);

	// calculateRoutes(routes);
};
