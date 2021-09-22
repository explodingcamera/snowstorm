import { lstatSync } from 'fs';
import { join } from 'path';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export const isSnowstormProject = (): string | void => {
	let userPkg;
	try {
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		userPkg = require(join(process.cwd(), './package.json'));
	} catch (_: unknown) {
		return 'No package.json in current working directory';
	}

	if (!Object.keys(userPkg.dependencies).find(k => k.includes('snowstorm'))) {
		return 'snowstorm not installed';
	}

	const pagesExists = lstatSync(join(process.cwd(), './pages')).isDirectory();
	const sitesExists = lstatSync(join(process.cwd(), './sites')).isDirectory();

	if (!pagesExists && !sitesExists) {
		return 'no pages/sites directory';
	}
};
