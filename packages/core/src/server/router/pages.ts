import glob from '../utils/glob.js';
import { join } from 'node:path';

import { pageGlob } from '../utils/is-page.js';
import normalizePath from 'normalize-path';

export const loadPages = async (pagesFolder: string) => {
	const routes = await glob(join(pagesFolder, pageGlob));
	return routes.map(r => r.replace(`${normalizePath(pagesFolder)}/`, ''));
};
