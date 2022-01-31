import React, {
	lazy,
	Suspense,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Route, Switch } from '@snowstorm/router';
import makeMatcher from '@snowstorm/router/lib/matcher';

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

const App = ({
	Wrapper,
	ErrorPage,
	initialPageName,
}: {
	Wrapper?: SnowstormCustomApp;
	ErrorPage: SnowstormCustomError;
	initialPageName?: string;
}) => {
	const [currentPage, setCurrentPage] = useState<
		ImportedPageModule | undefined
	>(() => (initialPageName && pagesCache.get(initialPageName)) || undefined);

	const currentp = useRef<ImportedPageModule | undefined>();
	if (!currentp.current)
		currentp.current = initialPageName
			? pagesCache.get(initialPageName)
			: undefined;

	const page = useMemo(
		() => (
			<Switch>
				{allRoutes.map(r => (
					<Route
						path={r.path}
						key={r.page}
						component={() => {
							const Page = lazy(async () => {
								const p = await loadPage(r.page);
								setCurrentPage(p);
								return { default: p.Component };
							});
							return (
								<Suspense fallback={<h1>Loading page...</h1>}>
									<Page />
								</Suspense>
							);
						}}
					/>
				))}
			</Switch>
		),
		[],
	);

	const site = Wrapper ? (
		<Wrapper exports={currentPage?.exports}>{page}</Wrapper>
	) : (
		page
	);

	return (
		<>
			<RouteAnnouncer />
			{site}
		</>
	);
};

const loadPage = async (page: string) => {
	const cachedPage = pagesCache.get(page);

	// cache hit
	if (cachedPage) return cachedPage;

	const newPage = await requestPage(page);

	// save to cache
	if (!cachedPage) pagesCache.set(page, newPage);

	return newPage;
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
		}
	});

	return (
		<App
			Wrapper={CustomApp}
			ErrorPage={ErrorPage}
			initialPageName={initalPageName}
		/>
	);
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
