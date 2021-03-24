import { hydrateSPs } from '@snowstorm/serverprops/lib/internal';
import React from 'react';
import { hydrate, render } from 'react-dom';
import {
	calculateRoutes,
	getCurrentPage,
	Page,
	requestPage,
	SnowstormPage,
} from './router';

const element = document.getElementById('app');

(async () => {
	const routes = calculateRoutes();
	const route = getCurrentPage({
		routes,
		location: document.location.pathname,
	});
	let pageComponent: SnowstormPage | undefined;
	try {
		if (route?.page) pageComponent = await requestPage(route?.page);
	} catch (error: unknown) {}

	const pageProps = {
		routes,
		initialPage: {
			route,
			component: pageComponent,
		},
	};

	if (element?.childNodes.length) {
		hydrateSPs();
		hydrate(<Page {...pageProps} />, element);
	} else {
		render(<Page {...pageProps} />, element);
	}
})();
