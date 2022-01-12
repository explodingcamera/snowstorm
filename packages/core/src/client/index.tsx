import { hydrateSPs } from '@snowstorm/serverprops/lib/internal';
import React from 'react';

import {} from 'react-dom/next';
import { createRoot } from 'react-dom';
import { Router } from 'wouter';
import {
	basePath,
	findRoute,
	ImportedPageModule,
	Page,
	requestPage,
} from './router';
import makeMatcher from 'wouter/matcher';

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

	const hydrate = Boolean(element?.childNodes.length);
	if (hydrate) hydrateSPs();
	if (element) createRoot(element, { hydrate }).render(page);
})();
