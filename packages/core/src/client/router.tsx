import React from 'react';
import { App } from './app';

export const loadPage = async () => {
	const { Page } = await import('./pages/page');

	const Component: React.FC = () => (
		<App>
			<Page />
		</App>
	);

	return Component;
};
