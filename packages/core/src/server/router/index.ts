import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { SnowstormInternalSiteConfig } from '../config.js';

import { loadNormalizedPages } from './pages.js';
import { loadRoutes, SnowstormRoute } from './routes.js';

export { pagePattern } from './pages.js';

export const generateRouter = async ({
	template,
	site,
}: {
	template: string;
	site: SnowstormInternalSiteConfig;
}) => {
	let tmp = (await readFile(template)).toString();
	const basePath = site.basePath.replace(/"/g, '');
	const pagesLocation = '_snowstorm-pages';

	let normalizedPages = await loadNormalizedPages(site.internal.pagesFolder);

	const customErrorPage = normalizedPages.includes('_error');
	const customAppPage = normalizedPages.includes('_app');

	normalizedPages = normalizedPages.filter(r => !r.startsWith('_'));
	const processedPages = normalizedPages.map(
		route => `  "${route}": () => import("${pagesLocation}/${route}")`,
	);

	if (customAppPage) {
		tmp = `import App from "${pagesLocation}/_app";\n${tmp}`;
	}

	tmp = `import Error from "${
		customErrorPage ? `${pagesLocation}/_error` : `_snowstorm/_error.js`
	}";\n${tmp}`;

	processedPages.push(
		`  "_app": () => ${customAppPage ? 'App' : 'undefined'}`,
		`  "_error": () => Error`,
	);

	const routes = await loadRoutes(normalizedPages, site);
	const processedRoutes = routes.map(route => {
		let routeString;
		try {
			const clientRoute: SnowstormRoute = {
				page: route.page,
				parts: route.parts ?? [],
				path: route.path ?? '',
			};
			routeString = JSON.stringify(clientRoute);
		} catch (_: unknown) {
			console.error('invalid route: ', route);
			return '';
		}

		return routeString;
	});

	tmp = tmp
		.replace('// insert-pages', processedPages.join(',\n'))
		.replace('// insert-routes', processedRoutes.join(',\n'))
		.replace('/* insert-base-path */', basePath);

	await writeFile(join(site.internal.internalFolder, '/routes.js'), tmp);
};
