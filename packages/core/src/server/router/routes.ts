import deepmerge from 'deepmerge';
import { importFile } from '../utils/import-file';

export interface SnowstormRoute {
	path: string;
	page: string;
	parts: string[];
}

export interface SnowstormCustomRoute {
	page: string; // for now this is required, we might add automatic page detection for custom routes later
	disabled?: boolean;
	exportProps?: () => Record<string, () => Promise<string[]>>;
}

export type SnowstormCustomRoutes = Record<string, SnowstormCustomRoute>;
type SnowstormCustomRoutesInternal = Record<
	string,
	SnowstormCustomRoute & Partial<SnowstormRoute> & { fileSystemRoute?: true }
>;

export interface RoutesConfigInternal {
	fileSystemRouting: boolean;
	customRoutes?: SnowstormCustomRoutes;
}

export type RoutesConfig = Partial<RoutesConfigInternal>;

const defaultRouteConfig: RoutesConfigInternal = {
	fileSystemRouting: true,
};

const processPage = (page: string) => {
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

	const fileSystemRoutes: string[] = [];
	if (routesConfig?.fileSystemRouting)
		fileSystemRoutes.push(...pages.filter(k => !k.startsWith('_')));

	let routes: SnowstormCustomRoutesInternal = Object.fromEntries(
		fileSystemRoutes
			.map(processPage)
			.map(({ path, ...rest }) => [
				path,
				{ ...rest, path, fileSystemRoute: true },
			]),
	);

	if (routesConfig.customRoutes)
		routes = { ...routes, ...routesConfig.customRoutes };

	return Object.entries(routes)
		.filter(([, { disabled }]) => !disabled)
		.map(([path, route]) => ({ ...route, path }))
		.map(route => {
			if (route.fileSystemRoute) {
				return route;
			}

			const { parts } = processPage(route.page);
			return {
				parts,
				...route,
			};
		})
		.sort(page => (page.parts?.slice(-1)[0].startsWith(':') ? 1 : -1));
};
