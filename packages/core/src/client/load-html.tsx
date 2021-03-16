import React from 'react';
import { renderToString } from 'react-dom/server';
import { loadPage } from './router';

import { Router } from 'wouter';
import staticLocationHook from 'wouter/static-location';

(global as any).location = {};

// we have to render the html here to prevent multiple instances of react from existing
export const loadHTML = async () => {
	const page = await loadPage();
	return renderToString(<Router hook={staticLocationHook('/')}>{page}</Router>);
};
