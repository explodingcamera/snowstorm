import React from 'react';
import { renderToString } from 'react-dom/server';
import {
	Page,
	calculateRoutes,
	getCurrentPage,
	requestPage,
	SnowstormPage,
} from './router';

import { Router } from 'wouter';
import staticLocationHook from 'wouter/static-location';

(window as any).location = {};

// we have to render the html here to prevent multiple instances of react from existing
export const loadHTML = async ({ path }: { path: string }) => {
	const routes = calculateRoutes();
	const route = getCurrentPage({ routes, location: path });

	let pageComponent: SnowstormPage | undefined;
	try {
		if (route?.page) pageComponent = await requestPage(route?.page);
	} catch (error: unknown) {}

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
