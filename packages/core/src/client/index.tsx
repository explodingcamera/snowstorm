import React from 'react';

import {} from 'react-dom/next';
import { hydrateRoot } from 'react-dom';
import { Router } from '@snowstorm/router';
import {
	basePath,
	findRoute,
	ImportedPageModule,
	Page,
	requestPage,
} from './router';
import makeMatcher from '@snowstorm/router/lib/matcher';

// prevent flash-of-unstyled-content in dev-mode
document.querySelector('.__snowstorm-dev-floc')?.remove();

const element = document.getElementById('app');

let loc = document.location.pathname;
if (loc.startsWith(basePath)) loc = loc.substr(basePath.length);
if (!loc.startsWith('/')) loc = '/' + loc;

(async () => {
	const route = findRoute({
		location: loc,
	});

	let pageComponent: ImportedPageModule | undefined;
	if (route?.page) pageComponent = await requestPage(route?.page);

	const initialPage = {
		route,
		Component: pageComponent?.Component,
		exports: pageComponent?.exports,
	};

	const matcher = makeMatcher();
	const page = (
		<Router matcher={matcher} base={basePath === '/' ? undefined : basePath}>
			<Page initialPage={initialPage} />
		</Router>
	);

	// const hydrate = Boolean(element?.childNodes.length);
	// if (hydrate) hydrateSPs();
	if (element) hydrateRoot(element, page);
})();
