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

// these are exported so we can use the transformed client code on our server
export * as internalHooks from '@snowstorm/serverprops/lib/internal';
export { getHead } from '@snowstorm/head/lib/internal';
export { pipeToNodeWritable } from 'react-dom/unstable-fizz.node';

interface args {
	initialPage: SnowstormPage | undefined;
	route: SnowstormRoute | undefined;
}

export const loadPage = async ({ path }: { path: string }): Promise<args> => {
	const route = findRoute({ location: path });

	let initialPage: SnowstormPage | undefined;
	if (route?.page) initialPage = await requestPage(route?.page);

	return { initialPage, route };
};

// we have to render the html here in the client code to prevent issues like
// multiple instances of react from existing
export const renderPage = async ({
	path,
	route,
	initialPage,
}: args & { path: string }) => {
	const loc = basePath === '/' ? path : basePath + path;

	return (
		<Router
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
