import React, { CSSProperties, useEffect, useState } from 'react';
import { Route, Switch } from 'wouter';
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

const capitalize = (string: string) =>
	string.charAt(0).toUpperCase() + string.slice(1);

const pagesCache = new Map<string, SnowstormPage>();
let lastPage = '';

const App = ({
	Wrapper,
	ErrorPage,
}: {
	Wrapper?: SnowstormCustomApp;
	ErrorPage: SnowstormCustomError;
}) => {
	const routeComponents = (
		<Switch>
			{allRoutes.map(r => (
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

	const site = Wrapper ? <Wrapper>{routeComponents}</Wrapper> : routeComponents;

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
const pageLoader = (page: string, lastPage: string) => {
	const Component: React.FC = () => {
		const [status, setStatus] = useState<PageStatus>('LOADING');
		const [error, setError] = useState<string>('');
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

		// load page asynchronously when the current page !== last page and
		useEffect(() => {
			if (loadPageAsync) {
				requestPage(page)
					.then(LoadedPage => {
						if (!pagesCache.get(page)) pagesCache.set(page, LoadedPage);
						setPage({ Page: LoadedPage, loadPageAsync: false });
					})
					.catch(e => {
						console.error(e);
						setError(e);
					});
			}
		}, [loadPageAsync]);

		if (error !== '') return <h1 style={h1Style} />;

		return Page ? <Page /> : <h1 style={h1Style}>loading</h1>;
	};

	return Component;
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

export const requestPage = async (page: string) => {
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
	return pageExport;
};

interface InitialPage {
	route?: SnowstormRoute;
	component?: SnowstormPage;
}

export const Page = ({ initialPage }: { initialPage: InitialPage }) => {
	const CustomApp: SnowstormCustomApp | undefined = allPages._app();
	const ErrorPage: SnowstormCustomError = allPages._error();

	useState(() => {
		const initalPageName = initialPage.route?.page;
		if (initalPageName && initialPage.component) {
			pagesCache.set(initalPageName, initialPage.component);
			lastPage = initalPageName;
		}
	});

	return <App Wrapper={CustomApp} ErrorPage={ErrorPage} />;
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
