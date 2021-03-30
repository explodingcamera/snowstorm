import deepmerge from 'deepmerge';
import { SnowstormRoute } from '../../client/router/shared';
import { importFile } from '../utils/import-file';

export interface RoutesConfigInternal {
	fileSystemRouting: boolean;
	customRoutes?: (
		initialRoutes?: SnowstormRoute[],
	) => Promise<SnowstormRoute[]>;
}

export type RoutesConfig = Partial<RoutesConfigInternal>;

const defaultRouteConfig: RoutesConfigInternal = {
	fileSystemRouting: true,
};

export const calculateRoutes = (pages: string[]): SnowstormRoute[] =>
	pages
		.filter(k => !k.startsWith('_'))
		.map(processPage)
		.sort(file => (file.parts.slice(-1)[0].startsWith(':') ? 1 : -1));

export const processPage = (page: string) => {
	const parts = page.split('/').map(part => {
		if (part === 'index') return '';
		if (part.startsWith('[') && part.endsWith(']'))
			return ':' + part.replace(/^\[|\]$/g, '');
		return part;
	});

	return {
		path: `/${parts.join('/').replace(/\/$/g, '')}`,
		page,
		parts,
	};
};

export const loadRoutes = async (path: string, pages: string[]) => {
	const routesFile = await importFile<RoutesConfig>(path, 'routes', 'Routes');

	const routesConfig = routesFile
		? deepmerge(defaultRouteConfig, routesFile)
		: defaultRouteConfig;

	let allRoutes = routesConfig.fileSystemRouting ? calculateRoutes(pages) : [];
	if (routesConfig.customRoutes) {
		allRoutes = await routesConfig.customRoutes(allRoutes);
	}

	return allRoutes;
};
