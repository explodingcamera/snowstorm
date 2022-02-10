import { join } from 'node:path';
import { cwd } from 'node:process';
import { lstatSync, readFileSync } from 'node:fs';

export const isSnowstormProject = (dir: string = cwd()): Error | true => {
	let userPkg;
	let deps: Record<string, string>;
	try {
		userPkg = JSON.parse(readFileSync(join(dir, './package.json')).toString());
		deps = {
			...(userPkg?.dependencies || []),
			...(userPkg?.devDependencies || []),
		};
	} catch (_: unknown) {
		return new Error('No valid package.json in current working directory');
	}

	let pagesExists = false;
	let sitesExists = false;
	try {
		pagesExists = lstatSync(join(dir, './pages')).isDirectory();
	} catch (_: unknown) {}

	try {
		sitesExists = lstatSync(join(dir, './sites')).isDirectory();
	} catch (_: unknown) {}

	console.log(Object.keys(deps));
	if (!Object.keys(deps).includes('@snowstorm/core')) {
		return new Error('snowstorm not installed');
	}

	if (!pagesExists && !sitesExists) {
		return new Error('no pages/sites directory');
	}

	if (pagesExists && sitesExists) {
		return new Error(
			"pages and sites directories can't exist at the same time",
		);
	}

	return true;
};
