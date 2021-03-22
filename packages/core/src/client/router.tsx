import React, { FunctionComponent, useState } from 'react';
import { Route, Switch } from 'wouter';
import makeMatcher from 'wouter/matcher';

// @ts-expect-error (Let this be resolved by esbuild instead of typescript)
import { routes as _allRoutes } from './internal/routes.js';

export type AllRoutes = {
	_error: () => SnowstormCustomError;
	_app: () => SnowstormCustomApp | undefined;
} & Record<string, () => Promise<Record<string, SnowstormPage>>>;
const allRoutes = _allRoutes as AllRoutes;
export interface SnowstormPage extends FunctionComponent {}
export interface SnowstormCustomError extends FunctionComponent {}
export interface SnowstormCustomApp extends FunctionComponent {}
export interface SnowstormRoute {
	path: string;
	page: string;
}

const capitalize = (string: string) =>
	string.charAt(0).toUpperCase() + string.slice(1);

const App = ({
	Wrapper,
	ErrorPage,
	routes,
	initialPage,
}: {
	Wrapper?: SnowstormCustomApp;
	ErrorPage: SnowstormCustomError;
	routes: SnowstormRoute[];
	initialPage: InitialPage;
}) => {
	const routeComponents = (
		<Switch>
			{routes.map(r => (
				<Route
					path={r.path}
					key={r.page}
					component={pageLoader(r.page, initialPage)}
				/>
			))}
		</Switch>
	);

	return Wrapper ? <Wrapper>{routeComponents}</Wrapper> : routeComponents;
};

type PageStatus = 'ERROR' | 'LOADING' | 'LOADED';
const pageLoader = (page: string, initialPage: InitialPage) => {
	const Component: React.FC = () => {
		const [status, setStatus] = useState<PageStatus>('LOADING');
		const [Page, setPage] = useState<SnowstormPage | undefined>(
			initialPage?.route?.page === page
				? () => initialPage.component
				: undefined,
		);

		return Page ? <Page /> : <h1>'loading'</h1>;
	};

	return Component;
};

const selectPageExport = (
	page: string,
	pageExports: Record<string, SnowstormPage>,
) => {
	const alternativeName = capitalize(
		page.split('/').slice(-1)[0].replace(/\[|\]/g, ''),
	);

	const Page: SnowstormPage | undefined =
		pageExports.default || pageExports[alternativeName] || undefined;

	return Page;
};

export const requestPage = async (page: string) =>
	allRoutes[page]().then(pageExports => selectPageExport(page, pageExports));

interface InitialPage {
	route?: SnowstormRoute;
	component?: SnowstormPage;
}

export const Page = ({
	routes,
	initialPage,
}: {
	routes: SnowstormRoute[];
	initialPage: InitialPage;
}) => {
	const CustomApp: SnowstormCustomApp | undefined = allRoutes._app();
	const ErrorPage: SnowstormCustomError = allRoutes._error();

	return (
		<App
			initialPage={initialPage}
			routes={routes}
			Wrapper={CustomApp}
			ErrorPage={ErrorPage}
		/>
	);
};

export const getCurrentPage = ({
	routes,
	location,
}: {
	routes: SnowstormRoute[];
	location: string;
}) => {
	const matcher = makeMatcher();

	for (const route of routes) {
		const match = matcher(route.path, location);
		if (match[0]) return route;
	}
};

export const calculateRoutes = (): SnowstormRoute[] =>
	Object.keys(allRoutes)
		.filter(k => !k.startsWith('_'))
		.map(processPage)
		.sort(file => (file.parts.slice(-1)[0].startsWith(':') ? 1 : -1));

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
