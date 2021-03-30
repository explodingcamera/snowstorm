import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { SnowstormConfigInternal } from '../config';
import { loadNormalizedPages } from './pages';
import { loadRoutes } from './routes';

export { pagePattern } from './pages';

export const generateRouter = async ({
	template,
	config,
}: {
	template: string;
	config: SnowstormConfigInternal;
}) => {
	let tmp = (await readFile(template)).toString();

	let normalizedPages = await loadNormalizedPages(config.internal.pagesFolder);
	const customErrorPage = normalizedPages.includes('_error');
	const customAppPage = normalizedPages.includes('_app');

	normalizedPages = normalizedPages.filter(r => !r.startsWith('_'));
	const processedPages = normalizedPages.map(
		route => `  "${route}": () => import("../pages/${route}.js")`,
	);

	if (customAppPage) {
		tmp = `import App from "../pages/_app.js";\n${tmp}`;
	}

	tmp = `import Error from "${
		customErrorPage ? '../pages/_error.js' : '../_error.js'
	}";\n${tmp}`;

	processedPages.push(
		`  "_app": () => ${customAppPage ? 'App' : 'undefined'}`,
		`  "_error": () => Error`,
	);

	const routes = await loadRoutes(config.internal.projectPath, normalizedPages);

	const processedRoutes = routes.map(route => {
		let routeString;
		try {
			routeString = JSON.stringify(route);
		} catch (error: unknown) {
			console.error('invalid route: ', route);
			return '';
		}

		return routeString;
	});

	tmp = tmp.replace('// insert-pages', processedPages.join(',\n'));
	tmp = tmp.replace('// insert-routes', processedRoutes.join(',\n'));

	await writeFile(join(config.internal.internalFolder, '/routes.js'), tmp);
};
