import deepmerge from 'deepmerge';
import { join } from 'path';
import { importFile } from './utils/import-file';

export interface SnowstormConfigInternal {
	export: {
		target:
			| 'github-pages'
			| 'gitlab-pages'
			| 'cloudflare-pages'
			| 'netlify'
			| 'independent';
	};
	internal: {
		snowstormFolder: string;
		snowpackFolder: string;
		internalFolder: string;
		pagesFolder: string;
		assetsFolder: string;
		clientFolder: string;
	};
}

type SnowstormConfig = Partial<SnowstormConfigInternal>;

export const loadConfig = async (
	path: string,
): Promise<SnowstormConfigInternal> => {
	const snowstormFolder = join(path, './.snowstorm');
	const snowpackFolder = join(snowstormFolder, './out');
	const internalFolder = join(snowstormFolder, './internal');
	const pagesFolder = join(path, './pages');
	const assetsFolder = join(__dirname, '../assets/public');
	const clientFolder = join(__dirname, '../client');

	const baseConfig: SnowstormConfig = {
		export: { target: 'independent' },
		internal: {
			snowstormFolder,
			snowpackFolder,
			internalFolder,
			pagesFolder,
			assetsFolder,
			clientFolder,
		},
	};

	const config = await importFile<SnowstormConfig>(
		path,
		'snowstorm.config',
		'Config',
	);

	return deepmerge(
		baseConfig,
		typeof config === 'object' ? config : baseConfig,
	);
};
