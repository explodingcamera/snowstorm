import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import makeMatcher from 'wouter/matcher';

import {
	routes as _allRoutes,
	pages as _pages,
	basePath as _basePath,
	// @ts-expect-error (Let this be resolved by esbuild instead of typescript)
} from '_snowstorm-internal/routes.js';
import { RouteAnnouncer } from './route-announcer';

import {
	Pages,
	SnowstormCustomApp,
	SnowstormCustomError,
	SnowstormPage,
	SnowstormRoute,
} from './shared.js';

export {
	SnowstormCustomApp,
	SnowstormCustomError,
	SnowstormPage,
	SnowstormRoute,
};

export const allPages: Pages = _pages;
export const allRoutes: SnowstormRoute[] = _allRoutes;
export const basePath: string = _basePath;

export interface ImportedPageModule {
	Component: SnowstormPage;
	exports: Record<string, any>;
}

export interface InitialPage {
	route?: SnowstormRoute;
	Component?: SnowstormPage;
	exports?: Record<string, any>;
}

const capitalize = (string: string) =>
	string.charAt(0).toUpperCase() + string.slice(1);

const pagesCache = new Map<string, ImportedPageModule>();
let lastPage = '';

let curr: ImportedPageModule | undefined;
const App = ({
	Wrapper,
	ErrorPage,
	initialPageName,
}: { 
	Wrapper?: SnowstormCustomApp;
	ErrorPage: SnowstormCustomError;
	initialPageName?: string;
}) => {
	const [currentPage, setCurrentPage] = useState<ImportedPageModule | undefined>(() => initialPageName && pagesCache.get(initialPageName) || undefined);
	curr = currentPage;

	const setPage = (page?: ImportedPageModule) => {
		if (page !== currentPage) 
			setCurrentPage(page)
	}
 
	const pageLoader = (r: SnowstormRoute) => () => {
		const page = usePage(r.page, lastPage);

		useEffect(() => {
			setPage(page)
		}, [page]);

		lastPage = r.page;
		if (!page?.Component) return <h1>loading</h1>

		const {Component} = page;
		return <Component/>
	}

	const routeComponents = useMemo(() => (
		<Switch>
			{allRoutes.map(r => (
				<Route
					path={r.path}
					key={r.page}
					component={pageLoader(r)}
				/>
			))}
		</Switch>
	), []);

	const site = Wrapper ? <Wrapper exports={currentPage?.exports}>{routeComponents}</Wrapper> : routeComponents;

	return (
		<>
			<RouteAnnouncer />
			{site}
		</>
	);
};

const h1Style: CSSProperties = {
	fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"`,
};

type PageStatus = 'ERROR' | 'LOADING' | 'LOADED';

const usePage = (page: string, lastPage: string) => {
		const [status, setStatus] = useState<PageStatus>('LOADING');
		const [error, setError] = useState<string>('');

		const [{ Page, loadPageAsync }, setPage] = useState<{
			loadPageAsync: boolean;
			Page: ImportedPageModule | undefined;
		}>(() => {
			const cachedPage = pagesCache.get(page);
			if (lastPage !== '' && lastPage !== page && !cachedPage) {
				return { Page: pagesCache.get(lastPage), loadPageAsync: true }; // keep the old page rendered till the new one is loaded
			}

			

			return { Page: cachedPage, loadPageAsync: cachedPage !== undefined };
		});

		// load page asynchronously when the current page !== last page and
		useEffect(() => {
			if (loadPageAsync) {
				requestPage(page)
					.then(loadedPage => {
						if (!pagesCache.get(page)) pagesCache.set(page, loadedPage);
							setPage({ Page: loadedPage, loadPageAsync: false });
					})
					.catch(e => {
						console.error(e);
						setError(e);
					});
			}
		}, [loadPageAsync]);
		return Page;
};

const calculateAlternativePageName = (page: string) =>
	capitalize(page.split('/').slice(-1)[0].replace(/\[|\]/g, ''));

const selectPageExport = (
	page: string,
	pageExports: Record<string, SnowstormPage>,
) => {
	const alternativeName = calculateAlternativePageName(page);
	const Page: SnowstormPage | undefined =
		pageExports.default || pageExports[alternativeName] || undefined;

	return Page;
};

export const requestPage = async (
	page: string,
): Promise<ImportedPageModule> => {
	const pageExports = await allPages[page]();
	const pageExport = selectPageExport(page, pageExports);
	if (!pageExport)
		return Promise.reject(
			new Error(
				`Failed to find page export for page '${page}'. Expected 'export default /* react component */' or 'export const ${calculateAlternativePageName(
					page,
				)} = /* react component */' `,
			),
		);
	return { Component: pageExport, exports: pageExports };
};

export const Page = ({ initialPage }: { initialPage: InitialPage }) => {
	const CustomApp: SnowstormCustomApp | undefined = allPages._app();
	const ErrorPage: SnowstormCustomError = allPages._error();

	const initalPageName = initialPage.route?.page;

	useState(() => {
		if (initalPageName && initialPage.Component) {
			pagesCache.set(initalPageName, {
				Component: initialPage.Component,
				exports: initialPage.exports || {},
			});
			lastPage = initalPageName;
		}
	});

	return <App Wrapper={CustomApp} ErrorPage={ErrorPage} initialPageName={initalPageName} />;
};

/**
 * @description finds the route name corresponding to a location string
 */
export const findRoute = ({ location }: { location: string }) => {
	const matcher = makeMatcher();

	for (const route of allRoutes) {
		const match = matcher(route.path, location);
		if (match[0]) return route;
	}
};
