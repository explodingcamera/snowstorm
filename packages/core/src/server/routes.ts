import { readFile, writeFile } from 'fs/promises';
import glob from 'glob-promise';
import { join } from 'path';

export const pagePattern = '/**/*.{js,jsx,ts,tsx}';
export const loadRoutes = async ({ pagesFolder }: { pagesFolder: string }) => {
	const routes = await glob(join(pagesFolder, pagePattern));
	return routes.map(r => r.replace(`${pagesFolder}/`, ''));
};

const isString = (str: string | undefined): str is string => Boolean(str);

export const loadNormalizedRoutes = async (pagesFolder: string) => {
	const routes = await loadRoutes({ pagesFolder });

	const normalizedRoutes = routes
		.map(r => RegExp(/(.*)\.(.*)/).exec(r))
		.map(r => (r ? r[1] : undefined))
		.filter(isString);
	return normalizedRoutes;
};

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

	let normalizedRoutes = await loadNormalizedRoutes(pagesFolder);
	const customErrorPage = normalizedRoutes.includes('_error');
	const customAppPage = normalizedRoutes.includes('_app');

	normalizedRoutes = normalizedRoutes
		.filter(r => !r.startsWith('_'))
		.map(route => `  "${route}": () => import("../pages/${route}.js")`);

	if (customAppPage) {
		tmp = `import App from "../pages/_app.js";\n${tmp}`;
	}

	tmp = `import Error from "${
		customErrorPage ? '../pages/_error.js' : '../_error.js'
	}";\n${tmp}`;

	normalizedRoutes.push(
		`  "_app": () => ${customAppPage ? 'App' : 'undefined'}`,
		`  "_error": () => Error`,
	);

	// normalizedRoutes.push('_error');
	tmp = tmp.replace('// insert-pages', normalizedRoutes.join(',\n'));
	await writeFile(join(internalFolder, '/routes.js'), tmp);
};
