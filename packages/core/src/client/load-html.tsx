import React from 'react';
import { renderToString } from 'react-dom/server';
import { loadPage } from './router';

// we have to render the html here to prevent multiple instances of react from existing
export const loadHTML = async ({ routes }: { routes: string[] }) => {
	const Component = await loadPage({ routes });
	return renderToString(<Component />);
};
