import { readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { join } from 'path';

export const pagePattern = '/**/*.{js,jsx,ts,tsx}';
export const loadRoutes = async ({ pagesFolder }: { pagesFolder: string }) => {
	const routes = await glob(join(pagesFolder, pagePattern));
	return routes.map(r => r.replace(`${pagesFolder}/`, ''));
};

const isString = (str: string | undefined): str is string => Boolean(str);

// only required for bundling
export const generateRoutes = async ({
	template,
	pagesFolder,
	internalFolder,
}: {
	template: string;
	pagesFolder: string;
	internalFolder: string;
}) => {
	let tmp = (await readFile(template)).toString();
	const routes = await loadRoutes({ pagesFolder });

	let normalizedRoutes = routes
		.map(r => RegExp(/(.*)\.(.*)/).exec(r))
		.map(r => (r ? r[1] : undefined))
		.filter(isString);

	const customErrorPage = normalizedRoutes.includes('_error');

	normalizedRoutes = normalizedRoutes
		.filter(r => !r.startsWith('_'))
		.map(route => `  "${route}": () => import("../pages/${route}.js")`);

	normalizedRoutes.push(
		`  "_error": () => import("${
			customErrorPage ? '../pages/_error.js' : '../_error.js'
		}")`,
	);

	// normalizedRoutes.push('_error');
	tmp = tmp.replace('// insert-pages', normalizedRoutes.join(',\n'));
	await writeFile(join(internalFolder, '/routes.js'), tmp);
};
