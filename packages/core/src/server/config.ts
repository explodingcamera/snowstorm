import deepmerge from 'deepmerge';
import { join, resolve } from 'path';
import { importFile } from './utils/import-file';
import { checkFileExists } from './utils/file-exists';
import { Except, PartialDeep } from 'type-fest';
import glob from 'glob-promise';
import { SnowstormRoutesConfig } from './router/routes';

export interface SnowstormInternalSiteConfig {
	pagesFolder: string;
	staticFolder: string;
	basePath: string;
	domain: string;
	export: {
		/**
		 * The directory where the website will be output to.
		 * In the case of `site`, this can be relative to the project root or an absoulte path,
		 * in the case of `sites`, relative paths are relative to the outputDir set in `site`
		 */
		outDir: string;
		target:
			| 'github-pages'
			| 'gitlab-pages'
			| 'cloudflare-pages'
			| 'netlify'
			| 'independent';
	};

	routes?: SnowstormRoutesConfig;

	/**
	 * @ignore
	 */
	internal: {
		name: string;
		snowpackFolder: string;
		internalFolder: string;
		staticFolder: string;
		pagesFolder: string;
	};
}

export type SnowstormSiteConfig = PartialDeep<
	Except<SnowstormInternalSiteConfig, 'internal'>
>;
export interface SnowstormMultiSiteConfig extends SnowstormSiteConfig {
	domain: string;
	alias: string[];
}

export interface SnowstormConfigInternal {
	/**
	 * The root folder for the snowstorm project
	 */
	rootFolder: string;

	/**
	 * Multisite only: The folder containing sites in Multisite-mode
	 */
	sitesFolder?: string;

	/**
	 * Multisite only: Sites includes a list of config ovverides for specific sites
	 */
	sites: SnowstormMultiSiteConfig[];

	/**
	 * Site is the base site config for all sites included in a snowstorm project
	 */
	site: SnowstormSiteConfig;

	/**
	 * Configuration relevant for development
	 */
	development: {
		port: number;
	};

	/**
	 * Configuration relevant for production
	 */
	production: {
		port: number;
	};

	/**
	 * @ignore
	 */
	internal: {
		rootFolder: string;
		sitesFolder?: string;
		snowstormFolder: string;
		snowstormAssetsFolder: string;
		snowstormClientFolder: string;
		sites: SnowstormInternalSiteConfig[];
		chwd: string;
	};
}

export type SnowstormBaseConfig = Except<SnowstormConfigInternal, 'internal'>;
export type SnowstormConfig = PartialDeep<SnowstormBaseConfig>;

const baseSite: Except<SnowstormInternalSiteConfig, 'domain' | 'internal'> = {
	pagesFolder: './pages',
	export: { target: 'independent', outDir: 'dist' },
	basePath: '/',
	staticFolder: './static',
};

export const loadConfig = async (
	path: string,
): Promise<SnowstormConfigInternal> => {
	const baseConfig: SnowstormBaseConfig = {
		rootFolder: path,
		sitesFolder: './sites',
		sites: [],
		site: baseSite,
		development: {
			port: 2020,
		},
		production: {
			port: 8080,
		},
	};

	const config = await importFile<SnowstormBaseConfig>(
		path,
		'snowstorm.config',
		'Config',
	);

	const res: SnowstormBaseConfig = deepmerge(
		baseConfig,
		typeof config === 'object' ? config : {},
	);

	const rootFolder = resolve(path, res.rootFolder);

	let sitesFolder = res.sitesFolder && resolve(rootFolder, res.sitesFolder);
	const sitesFolderExists = sitesFolder && (await checkFileExists(sitesFolder));
	if (!sitesFolderExists) sitesFolder = undefined;

	if (!res.site.basePath?.startsWith('/'))
		throw new Error("Snowstorm: config.site.basepath needs to begin with '/'");

	const snowstormFolder = join(rootFolder, './.snowstorm');

	const conf: SnowstormConfigInternal = {
		...res,
		internal: {
			rootFolder,
			sitesFolder,
			snowstormFolder,
			snowstormAssetsFolder: join(__dirname, '../assets/public'),
			snowstormClientFolder: join(__dirname, '../client'),
			sites: [],
			chwd: path,
		},
	};
	conf.internal.sites = await processSites(conf);

	return conf;
};

const processSites = async (
	config: SnowstormConfigInternal,
): Promise<SnowstormInternalSiteConfig[]> => {
	const sites = [config.site];

	if (config.sitesFolder) {
		const sitesContent = await glob(
			join(config.internal.rootFolder, config.sitesFolder, '/*'),
		);

		for (const siteName of sitesContent) {
			const existingConfig = config.sites.find(
				site => site.domain === siteName,
			);

			sites.push(
				deepmerge(
					{
						domain: /([^/]*)\/*$/.exec(siteName)?.[1] ?? '',
					},
					existingConfig ?? {},
				),
			);
		}
	}

	return sites
		.map(site => {
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			const name = (site.domain || 'default')
				.replace(/[^a-z0-9]/gi, '_')
				.toLowerCase();

			const basePath = config.internal.sitesFolder
				? join(
						config.internal.sitesFolder,
						site.domain ? `./${site.domain}` : '../',
				  )
				: config.internal.rootFolder;

			const resultSite = deepmerge(baseSite, site);

			return {
				...resultSite,
				domain: site.domain ?? 'default',
				internal: {
					name,
					snowpackFolder: join(
						config.internal.snowstormFolder,
						`./${name}`,
						'./out',
					),
					internalFolder: join(
						config.internal.snowstormFolder,
						`./${name}`,
						'./internal',
					),
					pagesFolder: join(basePath, resultSite.pagesFolder),
					staticFolder: join(basePath, resultSite.staticFolder),
				},
			};
		})
		.sort((a, b) => a.domain.length - b.domain.length);
};
