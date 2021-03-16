import React, { FunctionComponent } from 'react';
import { App } from './app';

// @ts-expect-error (Let this be resolved by esbuild instead of typescript)
import { routes as defaultRoutes } from './internal/routes.js';

interface SnowstormPage extends FunctionComponent {}

export const loadPage = async () => {
	let Index: SnowstormPage;
	try {
		if (true) {
			Index = (await defaultRoutes[true ? 'inde' + 'x' : '_error']()).Index;
			// @ts-expect-error (Let this be resolved by esbuild instead of typescript)
			await import('./pages/_error.js');
			// https://github.com/evanw/esbuild/issues/56#issuecomment-643100248
		}
	} catch (error: unknown) {}

	const Component: React.FC = () => <App>{Index && <Index />}</App>;

	return Component;
};
