import deepmerge from 'deepmerge';
import { join } from 'path';
import { importFile } from './utils/import-file';
import { Except, PartialDeep } from 'type-fest';

export interface SnowstormConfigInternal {
	export: {
		outDir: string;
		target:
			| 'github-pages'
			| 'gitlab-pages'
			| 'cloudflare-pages'
			| 'netlify'
			| 'independent';
	};
	devServer: {
		port: number;
	};
	server: {
		port: number;
		basePath: string;
	};

	/**
	 * @ignore
	 */
	internal: {
		projectPath: string;
		snowstormFolder: string;
		snowpackFolder: string;
		internalFolder: string;
		pagesFolder: string;
		assetsFolder: string;
		clientFolder: string;
	};
}

export type SnowstormConfig = Except<
	PartialDeep<SnowstormConfigInternal>,
	'internal'
>;

export const loadConfig = async (
	path: string,
): Promise<SnowstormConfigInternal> => {
	const snowstormFolder = join(path, './.snowstorm');
	const snowpackFolder = join(snowstormFolder, './out');
	const internalFolder = join(snowstormFolder, './internal');
	const pagesFolder = join(path, './pages');
	const assetsFolder = join(__dirname, '../assets/public');
	const clientFolder = join(__dirname, '../client');

	const baseConfig: SnowstormConfigInternal = {
		export: { target: 'independent', outDir: 'dist' },
		devServer: {
			port: 2020,
		},
		server: {
			port: 8080,
			basePath: '/',
		},
		internal: {
			projectPath: path,
			snowstormFolder,
			snowpackFolder,
			internalFolder,
			pagesFolder,
			assetsFolder,
			clientFolder,
		},
	};

	const config = await importFile<Partial<SnowstormConfigInternal>>(
		path,
		'snowstorm.config',
		'Config',
	);

	return deepmerge(baseConfig, typeof config === 'object' ? config : {});
};
