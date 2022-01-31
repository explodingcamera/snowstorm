import React from 'react';

import {
	Page,
	findRoute,
	requestPage,
	SnowstormRoute,
	basePath,
	ImportedPageModule,
} from './router';

import { Router } from '@snowstorm/router';
import staticLocationHook from '@snowstorm/router/lib/static-location';
import makeMatcher from '@snowstorm/router/lib/matcher';

// these are exported so we can use the transformed client code on our server
export { getHead } from '@snowstorm/head/lib/internal';

import {} from 'react-dom/next';
export { renderToPipeableStream } from 'react-dom/server';

interface args {
	initialPage: ImportedPageModule | undefined;
	route: SnowstormRoute | undefined;
	page?: string;
}

export const loadPage = async ({ path }: { path: string }): Promise<args> => {
	const route = findRoute({ location: path });
	let initialPage: ImportedPageModule | undefined;
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
					Component: initialPage?.Component,
					exports: initialPage?.exports,
				}}
			/>
		</Router>
	);
};
