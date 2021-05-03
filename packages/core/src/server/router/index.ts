import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import {
	SnowstormConfigInternal,
	SnowstormInternalSiteConfig,
} from '../config';

import { loadNormalizedPages } from './pages';
import { loadRoutes, SnowstormRoute } from './routes';

export { pagePattern } from './pages';

export const generateRouter = async ({
	template,
	site,
	config,
}: {
	template: string;
	site: SnowstormInternalSiteConfig;
	config: SnowstormConfigInternal;
}) => {
	let tmp = (await readFile(template)).toString();
	const basePath = site.basePath.replace(/"/g, '');

	const pagesLocation = '../pages';

	let normalizedPages = await loadNormalizedPages(site.internal.pagesFolder);
	const customErrorPage = normalizedPages.includes('_error');
	const customAppPage = normalizedPages.includes('_app');

	normalizedPages = normalizedPages.filter(r => !r.startsWith('_'));
	const processedPages = normalizedPages.map(
		route => `  "${route}": () => import("${pagesLocation}/${route}.js")`,
	);

	if (customAppPage) {
		tmp = `import App from "${pagesLocation}/_app.js";\n${tmp}`;
	}

	tmp = `import Error from "${
		customErrorPage ? `${pagesLocation}/_error.js` : `./_error.js`
	}";\n${tmp}`;

	processedPages.push(
		`  "_app": () => ${customAppPage ? 'App' : 'undefined'}`,
		`  "_error": () => Error`,
	);

	const routes = await loadRoutes(config.internal.rootFolder, normalizedPages);

	const processedRoutes = routes.map(route => {
		let routeString;
		try {
			const clientRoute: SnowstormRoute = {
				page: route.page,
				parts: route.parts ?? [],
				path: route.path,
			};
			routeString = JSON.stringify(clientRoute);
		} catch (error: unknown) {
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
