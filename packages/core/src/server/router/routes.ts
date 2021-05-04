import deepmerge from 'deepmerge';
import { SnowstormInternalSiteConfig } from './../config';

export interface SnowstormRoute {
	path: string;
	page: string;
	parts: string[];
}

export interface SnowstormCustomRoute {
	page: string; // for now this is required, we might add automatic page detection for custom routes later
	disabled?: boolean;
	exportParams?: () => Promise<string[][]>;
}

export type SnowstormCustomRoutes = Record<string, SnowstormCustomRoute>;
type SnowstormCustomRoutesInternal = Record<
	string,
	SnowstormCustomRoute & Partial<SnowstormRoute> & { fileSystemRoute?: true }
>;

export interface SnowstormRoutesConfig {
	fileSystemRouting?: boolean;
	customRoutes?: SnowstormCustomRoutes;
}

const defaultRouteConfig: SnowstormRoutesConfig = {
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

export const loadRoutes = async (
	pages: string[],
	site: SnowstormInternalSiteConfig,
) => {
	const routesConfig = site.routes
		? deepmerge(defaultRouteConfig, site.routes)
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
