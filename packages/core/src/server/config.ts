import deepmerge from 'deepmerge';
import { dirname, join, resolve } from 'path';
import { importFile } from './utils/import-file.js';
import { checkFileExists } from './utils/file-exists.js';
import { Except, PartialDeep } from 'type-fest';
import glob from 'fast-glob';
import { SnowstormRoutesConfig } from './router/routes.js';
import { Logger } from 'tslog';
import { fileURLToPath } from 'url';
import { CSSOptions, JsonOptions, PluginOption } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface SnowstormExportConfig {
	/**
	 * The directory where the website will be output to.
	 * In the case of `site`, this can be relative to the project root or an absolute path,
	 * in the case of `sites`, relative paths are relative to the outputDir set in `site`
	 */
	outDir: string;
	target:
		| 'github-pages'
		| 'gitlab-pages'
		| 'cloudflare-pages'
		| 'netlify'
		| 'independent';
}

export interface SnowstormBuildOptions {
	css?: CSSOptions;
	json?: JsonOptions;
	vitePlugins?: Array<PluginOption | PluginOption[]>;

	// force pre-bundle module. can be helpful if commonjs packages are not detected and thus not converted to esm
	forcePrebundle?: string[];
}

export interface SnowstormSiteConfigInternal {
	pagesFolder: string;
	staticFolder: string;
	basePath: string;
	domain: string;

	/**
	 * The base config for building a snowstorm site
	 */
	build: SnowstormBuildOptions;
	routes?: SnowstormRoutesConfig;

	/**
	 * @ignore
	 */
	internal: {
		name: string;
		viteFolder: string;
		internalFolder: string;
		baseFolder: string;
		staticFolder: string;
		pagesFolder: string;
		log: Logger;
	};
}

export type SnowstormSiteConfig = PartialDeep<
	Except<SnowstormSiteConfigInternal, 'internal'>
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
	 * Configuration relevant for exporting sites
	 */
	export: SnowstormExportConfig;

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
		sites: SnowstormSiteConfigInternal[];
		chwd: string;
		log: Logger;
	};
}

export type SnowstormBaseConfig = Except<SnowstormConfigInternal, 'internal'>;
export type SnowstormConfig = PartialDeep<SnowstormBaseConfig>;

const baseSite: Except<SnowstormSiteConfigInternal, 'domain' | 'internal'> = {
	pagesFolder: './pages',
	build: {},
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
		export: { target: 'independent', outDir: 'dist' },
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

	const log = new Logger({
		displayDateTime: false,
		displayFilePath: 'hidden',
		displayFunctionName: false,
		minLevel: 'info',
	});

	// logger.level = 'silent';
	// logger.error = msg => log.error(msg);
	// logger.warn = msg => log.warn(msg);
	// logger.debug = msg => log.debug(msg);
	// logger.info = msg => log.debug(msg);

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
			log,
		},
	};
	conf.internal.sites = await processSites(conf);

	return conf;
};

const processSites = async (
	config: SnowstormConfigInternal,
): Promise<SnowstormSiteConfigInternal[]> => {
	const sites = [];

	if (config.internal.sitesFolder) {
		const sitesContent = await glob(join(config.internal.sitesFolder, '/**'), {
			onlyFiles: false,
			deep: 1,
		});

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
	} else {
		sites.push(config.site);
	}

	return (
		sites
			.map(site => {
				const name = (site.domain || 'default')
					.replace(/[^a-z0-9]/gi, '_')
					.toLowerCase();

				const baseFolder = config.internal.sitesFolder
					? join(
							config.internal.sitesFolder,
							site.domain ? `./${site.domain}` : './default',
					  )
					: config.internal.rootFolder;

				const resultSite = deepmerge(baseSite, site);

				const internalFolder = join(
					config.internal.snowstormFolder,
					`./${name}`,
					'./internal',
				);

				return {
					...resultSite,
					domain: site.domain ?? 'default',
					internal: {
						log: config.internal.log.getChildLogger({
							displayLoggerName: sites.length > 1,
							name,
						}),
						name,
						baseFolder,
						viteFolder: join(internalFolder, './vite-out'),
						internalFolder,
						pagesFolder: join(baseFolder, resultSite.pagesFolder),
						staticFolder: join(baseFolder, resultSite.staticFolder),
					},
				};
			})
			// sort domains by length to prevent issues with routing logic
			.sort((a, b) => a.domain.length - b.domain.length)
	);
};
