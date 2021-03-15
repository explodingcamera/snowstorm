import React from 'react';
import { hydrate, render } from 'react-dom';
import { loadPage } from './router';

const element = document.getElementById('app');

(async () => {
	const Component = await loadPage();

	console.log(Component);

	if (element?.childNodes.length) {
		hydrate(<Component />, element, () => {
			console.log('hydrated');
		});
	} else {
		render(<Component />, element);
	}
})();
