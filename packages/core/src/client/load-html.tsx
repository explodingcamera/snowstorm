import React from 'react';

import {
	Page,
	findRoute,
	requestPage,
	SnowstormPage,
	SnowstormRoute,
	basePath,
} from './router';

import { Router } from 'wouter';
import staticLocationHook from 'wouter/static-location';
import makeMatcher from 'wouter/matcher';

// these are exported so we can use the transformed client code on our server
export * as serverprops from '@snowstorm/serverprops/lib/internal';
export { getHead } from '@snowstorm/head/lib/internal';

import {} from 'react-dom/next';
export { renderToPipeableStream } from 'react-dom/server';

interface args {
	initialPage: SnowstormPage | undefined;
	route: SnowstormRoute | undefined;
	page?: string;
}

export const loadPage = async ({ path }: { path: string }): Promise<args> => {
	const route = findRoute({ location: path });

	let initialPage: SnowstormPage | undefined;

	if (route?.page) initialPage = await requestPage(route?.page);

	return { initialPage, route, page: route?.page };
};

// we have to render the html here in the client code to prevent issues like
// multiple instances of react from existing
export const renderPage = async ({
	path,
	route,
	initialPage,
}: args & { path: string }) => {
	const loc = basePath === '/' ? path : basePath + path;
	const matcher = makeMatcher();

	return (
		<Router
			matcher={matcher}
			hook={staticLocationHook(loc)}
			base={basePath === '/' ? undefined : basePath}
		>
			<Page
				initialPage={{
					route,
					component: initialPage,
				}}
			/>
		</Router>
	);
};
