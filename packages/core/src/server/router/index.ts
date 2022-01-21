import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { SnowstormSiteConfigInternal } from '../config.js';
import {
	stripFileExtension,
	stripFileExtensions,
} from '../utils/strip-file-extension.js';

import { loadPages } from './pages.js';
import { loadRoutes, SnowstormRoute } from './routes.js';

export const generateRouter = async ({
	template,
	site,
}: {
	template: string;
	site: SnowstormSiteConfigInternal;
}) => {
	let tmp = (await readFile(template)).toString();
	const basePath = site.basePath.replace(/"/g, '');
	const pagesLocation = '_snowstorm-pages';

	let pages = await loadPages(site.internal.pagesFolder);
	if (!pages.length) {
		site.internal.log.fatal('No pages, have you created a pages folder?');
		process.exit(1);
	}

	const normalizedPages = stripFileExtensions(pages);

	const customErrorPage = normalizedPages.includes('_error');
	const customAppPage = normalizedPages.includes('_app');

	pages = pages.filter(r => !r.startsWith('_'));
	const processedPages = pages.map(
		route =>
			`  "${stripFileExtension(
				route,
			)}": () => import("${pagesLocation}/${route}")`,
	);

	if (customAppPage) {
		tmp = `import App from "${pagesLocation}/_app";\n${tmp}`;
	}

	if (customErrorPage) {
		tmp = `import Error from "${
			customErrorPage
				? `${pagesLocation}/_error`
				: `@snowstorm/core/client/_error.js`
		}";\n${tmp}`;
	}

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
