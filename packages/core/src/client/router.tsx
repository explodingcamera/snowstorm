import React, { FunctionComponent } from 'react';
import { App } from './app';

interface SnowstormPage extends FunctionComponent {}

const suffix = '.js';

export const loadPage = async ({
	pathPrefix,
	routes,
}: {
	pathPrefix: string;
	routes: string[];
}) => {
	let Index: SnowstormPage;
	try {
		if (true) {
			// TODO: should we generate a file and put it in .snowstorm with a list of all routes you can import?
			// we can't make this string dynamic since otherwise esbuild won't bundle our files corectly
			// (this is only a concern for non-esm compatible browsers so we can keep the old bohavior for
			// dev mode to make keeping hotreloading, adding new routes, simple)
			// https://github.com/evanw/esbuild/issues/56#issuecomment-643100248
			// @ts-expect-error (Let this be resolved by esbuild instead of typescript)
			const file = await import('./pages/index.js');
			Index = file.Index;
		}
	} catch (error: unknown) {}

	const Component: React.FC = () => <App>{Index && <Index />}</App>;

	return Component;
};
