import glob from 'fast-glob';
import { join } from 'node:path';

import { pageGlob } from '../utils/is-page.js';

export const loadPages = async (pagesFolder: string) => {
	const routes = await glob(join(pagesFolder, pageGlob));
	return routes.map(r => r.replace(`${pagesFolder}/`, ''));
};
