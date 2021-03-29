import { loadConfig } from './config';
import { loadNormalizedRoutes } from './routes';
import { processPage } from '../client/router/shared';

export const exportProject = async ({ path }: { path: string }) => {
	const config = await loadConfig(path);
	const routes = await loadNormalizedRoutes(config.internal.pagesFolder);

	const allRoutes = routes.map(processPage);

	const renderRoutes = allRoutes
		.filter(r => !r.parts.some(part => part.startsWith(':')))
		.filter(r => !r.path.startsWith('/_error') && !r.path.startsWith('/_app'));

	console.log(renderRoutes);
};
