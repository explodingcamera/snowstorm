import { hydrate, render } from 'react-dom';
import { loadPage } from './router';

const element = document.getElementById('app');

(async () => {
	const page = await loadPage();

	if (element?.childNodes.length) {
		hydrate(page, element);
	} else {
		render(page, element);
	}
})();
