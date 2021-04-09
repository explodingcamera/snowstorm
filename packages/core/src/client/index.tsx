import { hydrateSPs } from '@snowstorm/serverprops/lib/internal';
import React from 'react';
import { hydrate, render } from 'react-dom';
import { Router } from 'wouter';
import {
	basePath,
	findRoute,
	Page,
	requestPage,
	SnowstormPage,
} from './router';

const element = document.getElementById('app');

let loc = document.location.pathname;
if (loc.startsWith(basePath)) loc = loc.substr(basePath.length);
if (!loc.startsWith('/')) loc = '/' + loc;

(async () => {
	const route = findRoute({
		location: loc,
	});

	let pageComponent: SnowstormPage | undefined;
	try {
		if (route?.page) pageComponent = await requestPage(route?.page);
	} catch (error: unknown) {}

	const pageProps = {
		initialPage: {
			route,
			component: pageComponent,
		},
	};

	const page = (
		<Router base={basePath === '/' ? undefined : basePath}>
			<Page {...pageProps} />
		</Router>
	);

	if (element?.childNodes.length) {
		hydrateSPs();
		hydrate(page, element);
	} else {
		render(page, element);
	}
})();
