import glob from 'glob-promise';
import { isString } from '../utils/is-string.js';
import { join } from 'path';

export const pagePattern = '/**/*.{js,jsx,ts,tsx}';
export const loadPages = async ({ pagesFolder }: { pagesFolder: string }) => {
	const routes = await glob(join(pagesFolder, pagePattern));
	return routes.map(r => r.replace(`${pagesFolder}/`, ''));
};

export const loadNormalizedPages = async (pagesFolder: string) => {
	const pages = await loadPages({ pagesFolder });

	const normalizedPages = pages
		.map(r => RegExp(/(.*)\.(.*)/).exec(r))
		.map(r => (r ? r[1] : undefined))
		.filter(isString);
	return normalizedPages;
};
