import React from 'react';
import { hydrate, render } from 'react-dom';
import { loadPage } from './router';

const element = document.getElementById('app');

(async () => {
	const Component = await loadPage();

	if (element?.childNodes.length) {
		hydrate(<Component />, element);
	} else {
		render(<Component />, element);
	}
})();
