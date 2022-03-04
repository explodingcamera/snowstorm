import deepmerge from 'deepmerge';

export interface Route {
	path: string;
	name: string;
	parts: string[];
	decorator?: string;
}

export interface CustomRoute {
	name: string;
	disabled?: boolean;
	decorator?: string;
	exportParams?: () => Promise<string[][]>;
}

export type CustomRoutes = Record<string, CustomRoute>;

type InternalCustomRoute = CustomRoute &
	Partial<Route> & { fileSystemRoute?: true };
type InternalCustomRouts = Record<string, InternalCustomRoute>;

export interface RouterConfig {
	fileSystemRouting?: boolean;
	customRoutes?: CustomRoutes;
}

const defaultRouteConfig: RouterConfig = {
	fileSystemRouting: true,
};

export const processRoute = (route: string): Route => {
	if (route.includes('..'))
		throw new Error(`route can't contains two adjacent dots: ${route}`);

	if (!/^[/0-9a-zA-Z[\]._-]*$/g.test(route))
		throw new Error(`route contains invalid characters: ${route}`);

	let parts = route.split('/');
	if (!parts || parts[0] === '')
		throw new Error(`invalid empty route: ${route}`);

	let decorator;
	let lastEl = parts[parts.length - 1];
	if (lastEl.includes('.')) {
		[lastEl, decorator] = lastEl.split('.');
		parts[parts.length - 1] = lastEl;
	}

	const name = parts.join('/');

	parts = parts.map(part => {
		if (part === 'index') return '';
		if (part.startsWith('[') && part.endsWith(']'))
			return ':' + part.replace(/^\[|\]$/g, '');
		return part;
	});

	return {
		path: `/${parts.join('/').replace(/\/$/g, '')}`,
		name,
		parts,
		decorator,
	};
};

export const loadRoutes = async (pages: string[], cfg?: RouterConfig) => {
	const routesConfig = cfg
		? deepmerge(defaultRouteConfig, cfg)
		: defaultRouteConfig;

	const fileSystemRoutes: string[] = [];
	if (routesConfig?.fileSystemRouting)
		fileSystemRoutes.push(...pages.filter(k => !k.startsWith('_')));

	const procesedRoutes = fileSystemRoutes.map(processRoute);
	let routes: InternalCustomRouts = Object.fromEntries(
		procesedRoutes.map(({ path, ...rest }) => [
			path,
			{ ...rest, path, fileSystemRoute: true },
		]),
	);

	if (routesConfig.customRoutes)
		routes = { ...routes, ...routesConfig.customRoutes };

	const x: InternalCustomRoute[] = Object.entries(routes)
		.filter(([, { disabled }]) => !disabled)
		.map(([path, route]) => ({ ...route, path }))
		.map(route => {
			if (route.fileSystemRoute) {
				return route;
			}

			const { parts } = processRoute(route.name);
			return {
				parts,
				...route,
			};
		})
		.sort(page => (page.parts?.slice(-1)[0].startsWith(':') ? 1 : -1));

	return x;
};
