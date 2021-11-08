import { lstatSync } from 'fs';
import { join } from 'path';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const isSnowstormProject = (): string | void => {
	let userPkg;
	try {
		userPkg = require(join(process.cwd(), './package.json'));
	} catch (_: unknown) {
		return 'No package.json in current working directory';
	}

	let pagesExists = false;
	let sitesExists = false;
	try {
		pagesExists = lstatSync(join(process.cwd(), './pages')).isDirectory();
	} catch (_: unknown) {}

	try {
		sitesExists = lstatSync(join(process.cwd(), './sites')).isDirectory();
	} catch (_: unknown) {}

	if (!Object.keys(userPkg.dependencies).find(k => k.includes('snowstorm'))) {
		return 'snowstorm not installed';
	}

	if (!pagesExists && !sitesExists) {
		return 'no pages/sites directory';
	}

	if (pagesExists && sitesExists) {
		return "pages and sites directories can't exist at the same time";
	}
};
