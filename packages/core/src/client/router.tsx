import React, { FunctionComponent } from 'react';
import { Router, Route } from 'wouter';

// @ts-expect-error (Let this be resolved by esbuild instead of typescript)
import { routes as defaultRoutes } from './internal/routes.js';

interface SnowstormPage extends FunctionComponent {}
interface SnowstormCustomError extends FunctionComponent {}
interface SnowstormCustomApp extends FunctionComponent {}
interface SnowstormRoute {
	path: string;
	page: string;
}

const capitalize = (string: string) =>
	string.charAt(0).toUpperCase() + string.slice(1);

const App = ({
	Wrapper,
	InitialPage,
	initialPageName,
	ErrorPage,
	routes,
}: {
	Wrapper?: SnowstormCustomApp;
	InitialPage?: SnowstormPage;
	initialPageName: string;
	ErrorPage: SnowstormCustomError;
	routes: SnowstormRoute[];
}) => {
	const routeComponents = (
		<>
			{routes.map(r => (
				<Route path={r.path} key={r.page}>
					{r.page === initialPageName && InitialPage && <InitialPage />}
				</Route>
			))}
		</>
	);

	return Wrapper ? <Wrapper>{routeComponents}</Wrapper> : routeComponents;
};

const requestPage = async (page: string) => {
	const pageExports = await defaultRoutes[page]();
	const Page: SnowstormPage | undefined =
		pageExports.default || pageExports[capitalize(page)] || undefined;

	return Page;
};

// TODO!!!
const pathToPagename = (path: string) => {
	return 'index';
};

// TODO!!!
const calculateRoutes = (): SnowstormRoute[] => {
	return [
		{
			path: '/',
			page: 'index',
		},
	];
};

export const loadPage = async () => {
	const CustomApp: SnowstormCustomApp | undefined = defaultRoutes._app();
	const ErrorPage: SnowstormCustomError = defaultRoutes._error();

	const initialPageName = pathToPagename(location.pathname);
	const InitialPage = await requestPage(initialPageName);
	const routes = calculateRoutes();

	return (
		<App
			routes={routes}
			InitialPage={InitialPage}
			initialPageName={initialPageName}
			Wrapper={CustomApp}
			ErrorPage={ErrorPage}
		/>
	);
};
