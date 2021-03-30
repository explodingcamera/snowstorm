import React from 'react';
import { renderToString } from 'react-dom/server';
import {
	Page,
	getCurrentPage,
	requestPage,
	SnowstormPage,
	SnowstormRoute,
} from './router';

import { Router } from 'wouter';
import staticLocationHook from 'wouter/static-location';

export * as internalHooks from '@snowstorm/serverprops/lib/internal';
export { getHead } from '@snowstorm/head/lib/internal';

interface args {
	initialPage: SnowstormPage | undefined;
	route: SnowstormRoute | undefined;
}

export const loadPage = async ({ path }: { path: string }): Promise<args> => {
	const route = getCurrentPage({ location: path });

	let initialPage: SnowstormPage | undefined;
	try {
		if (route?.page) initialPage = await requestPage(route?.page);
	} catch (error: unknown) {
		console.log(error);
	}

	return { initialPage, route };
};

// we have to render the html here to prevent multiple instances of react from existing
export const renderPage = async ({
	path,
	route,
	initialPage,
}: args & { path: string }) => {
	return renderToString(
		<Router hook={staticLocationHook(path)}>
			<Page
				initialPage={{
					route: route,
					component: initialPage,
				}}
			/>
		</Router>,
	);
};
