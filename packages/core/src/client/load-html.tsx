import React from 'react';
import { renderToString } from 'react-dom/server';
import {
	Page,
	calculateRoutes,
	getCurrentPage,
	requestPage,
	SnowstormPage,
	SnowstormRoute,
} from './router';

import { Router } from 'wouter';
import staticLocationHook from 'wouter/static-location';

export * as internalHooks from '@snowstorm/hooks/lib/internal';
export { getHead } from '@snowstorm/head/lib/internal';

interface args {
	pageComponent: SnowstormPage | undefined;
	route: SnowstormRoute | undefined;
	routes: SnowstormRoute[];
}

export const loadPage = async ({ path }: { path: string }): Promise<args> => {
	const routes = calculateRoutes();
	const route = getCurrentPage({ routes, location: path });

	let pageComponent: SnowstormPage | undefined;
	try {
		if (route?.page) pageComponent = await requestPage(route?.page);
	} catch (error: unknown) {
		console.log(error);
	}

	return { pageComponent, route, routes };
};

// we have to render the html here to prevent multiple instances of react from existing
export const renderPage = async ({
	path,
	route,
	pageComponent,
	routes,
}: args & { path: string }) => {
	return renderToString(
		<Router hook={staticLocationHook(path)}>
			<Page
				initialPage={{
					route: route,
					component: pageComponent,
				}}
				routes={routes}
			/>
		</Router>,
	);
};
