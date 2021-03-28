import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'wouter';
import makeMatcher from 'wouter/matcher';

// @ts-expect-error (Let this be resolved by esbuild instead of typescript)
import { routes as _allRoutes } from './../internal/routes.js';

import {
	AllRoutes,
	SnowstormCustomApp,
	SnowstormCustomError,
	SnowstormPage,
	SnowstormRoute,
	calculateRoutes as calculateRoutesInternal,
} from './shared.js';

export {
	SnowstormCustomApp,
	SnowstormCustomError,
	SnowstormPage,
	SnowstormRoute,
};

const allRoutes = _allRoutes as AllRoutes;
const capitalize = (string: string) =>
	string.charAt(0).toUpperCase() + string.slice(1);

export const calculateRoutes = () => calculateRoutesInternal(allRoutes);

const pagesCache = new Map<string, SnowstormPage>();
let lastPage = '';

const App = ({
	Wrapper,
	ErrorPage,
	routes,
}: {
	Wrapper?: SnowstormCustomApp;
	ErrorPage: SnowstormCustomError;
	routes: SnowstormRoute[];
}) => {
	const routeComponents = (
		<Switch>
			{routes.map(r => (
				<Route
					path={r.path}
					key={r.page}
					component={() => {
						const page = pageLoader(r.page, lastPage);
						lastPage = r.page;
						return page({});
					}}
				/>
			))}
		</Switch>
	);

	return Wrapper ? <Wrapper>{routeComponents}</Wrapper> : routeComponents;
};

type PageStatus = 'ERROR' | 'LOADING' | 'LOADED';
const pageLoader = (page: string, lastPage: string) => {
	const Component: React.FC = () => {
		const [status, setStatus] = useState<PageStatus>('LOADING');
		const [{ Page, loadPageAsync }, setPage] = useState<{
			loadPageAsync: boolean;
			Page: SnowstormPage | undefined;
		}>(() => {
			const cachedPage = pagesCache.get(page);

			if (lastPage !== '' && lastPage !== page && !cachedPage) {
				return { Page: pagesCache.get(lastPage), loadPageAsync: true }; // keep the old page rendered till the new one is loaded
			}

			return { Page: cachedPage, loadPageAsync: cachedPage !== undefined };
		});

		// load page asyncronusly when the current page !== last page and
		useEffect(() => {
			if (loadPageAsync) {
				requestPage(page)
					.then(LoadedPage => {
						if (!pagesCache.get(page)) pagesCache.set(page, LoadedPage);
						setPage({ Page: LoadedPage, loadPageAsync: false });
					})
					.catch(e => console.error(e));
			}
		}, [loadPageAsync]);

		return Page ? <Page /> : <h1>loading</h1>;
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

	useState(() => {
		const initalPageName = initialPage.route?.page;
		if (initalPageName && initialPage.component) {
			pagesCache.set(initalPageName, initialPage.component);
			lastPage = initalPageName;
		}
	});

	return <App routes={routes} Wrapper={CustomApp} ErrorPage={ErrorPage} />;
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
