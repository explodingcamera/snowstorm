import Koa from 'koa';
import c2k from 'koa-connect';
import mount from 'koa-mount';
import serve from 'koa-static';
import compress from 'koa-compress';
import chokidar from 'chokidar';

import {
	build,
	createServer,
	CSSOptions,
	InlineConfig,
	JsonOptions,
	Plugin,
	PluginOption,
} from 'vite';

import {
	SnowstormConfigInternal,
	SnowstormSiteConfigInternal,
} from './config.js';
import reactRefresh from '@vitejs/plugin-react-refresh';

import { dirname, join } from 'path';
import { mkdir } from 'fs/promises';

import { getFreePort } from './utils/free-port.js';
import { ssr } from './ssr.js';
import { generateRouter, pagePattern } from './router/index.js';
import { fileURLToPath } from 'url';
import deepmerge from 'deepmerge';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export let modules: Array<{
	id: string;
	dependencies: string[];
}> = [];

function snowstormCollectModules(base: string): Plugin {
	return {
		name: 'snowstorm-collect-modules',
		generateBundle() {
			const ids: string[] = [];
			for (const moduleId of this.getModuleIds()) {
				ids.push(moduleId);
			}

			const getAllDeps = (id: string) => {
				let seen: string[] = [];
				const getDependencies = (id: string) => {
					if (seen.includes(id)) return;
					seen.push(id);
					let deps = this.getModuleInfo(id)?.importedIds;
					if (!deps) return;
					deps = deps.filter(d => !seen.includes(d));
					seen = [...seen, ...deps];
					for (const dep of deps) getDependencies(dep);
				};

				getDependencies(id);
				return seen.filter(i => i !== id);
			};

			modules = ids
				.filter(id => id.startsWith(base))
				.map(id => ({
					id,
					dependencies: getAllDeps(id),
				}));
		},
	};
}

const viteBaseConfig = (
	config: SnowstormConfigInternal,
	site: SnowstormSiteConfigInternal,
): InlineConfig => ({
	root: config.internal.rootFolder,
	cacheDir: join(site.internal.viteFolder, './.vite'),
	configFile: false,
	plugins: [
		// snowstorm's default plugins
		...[reactRefresh(), snowstormCollectModules(site.internal.baseFolder)],

		// default site plugins
		...(site.build.vitePlugins || []),

		// site specific plugins
		...((config.site.build?.vitePlugins as Array<
			PluginOption | PluginOption[]
		>) || []),
	],
	// @ts-expect-error - ssr is considered in alpha, so not yet exposed by Vite
	ssr: { noExternal: ['wouter', /@snowstorm/] },
	css: deepmerge.all([
		// snowstorm's default css options
		{
			modules: { localsConvention: 'camelCaseOnly' },
			postcss: {},
		},
		// default site css options
		site.build.css || {},
		// site specific css options
		config.site.build?.css || {},
	]),
	json: deepmerge.all([site.build.json || {}, config.site.build?.css || {}]),
	esbuild: {
		jsxFactory: '_jsx',
		jsxFragment: '_jsxFragment',
		jsxInject: `import { createElement as _jsx, Fragment as _jsxFragment } from 'react'`,
	},
	resolve: {
		alias: {
			_snowstorm: config.internal.snowstormClientFolder,
			'_snowstorm-internal': site.internal.internalFolder,
			'_snowstorm-pages': site.internal.pagesFolder,
		},
	},
	optimizeDeps: {
		include: [
			...(site.build.forcePrebundle || []),
			...(config.site?.build?.forcePrebundle || []),
		] as string[],
	},
	build: {
		commonjsOptions: {
			transformMixedEsModules: true,
		},
		rollupOptions: {
			input: join(config.internal.snowstormClientFolder, './index.js'),
		},
	},
});

const viteProdConfig = (
	config: SnowstormConfigInternal,
	site: SnowstormSiteConfigInternal,
	server: boolean,
): InlineConfig => ({
	...viteBaseConfig(config, site),
	// kinda ugly :(
	root: config.internal.snowstormAssetsFolder,
	build: {
		commonjsOptions: {
			transformMixedEsModules: true,
		},
		outDir: site.internal.viteFolder + (server ? '/server' : '/client'),
		emptyOutDir: true,
		ssr: server,
		ssrManifest: !server,
		rollupOptions: {
			input: server
				? join(config.internal.snowstormClientFolder, './load-html.js')
				: join(config.internal.snowstormAssetsFolder, './index.html'),
		},
	},
});

const createViteServer = async ({
	dev,
	config,
	site,
}: {
	dev: boolean;
	config: SnowstormConfigInternal;
	site: SnowstormSiteConfigInternal;
}) => {
	const hmrPort = (dev && (await getFreePort())) || 0;
	const server = await createServer({
		server: { middlewareMode: 'ssr', hmr: { port: hmrPort } },
		// publicDir: snowstormAssetsFolder,
		...viteBaseConfig(config, site),
	});

	return server;
};

export const startSite = async ({
	dev,
	config,
	site,
}: {
	dev: boolean;
	config: SnowstormConfigInternal;
	site: SnowstormSiteConfigInternal;
}): Promise<Koa> => {
	if (dev) site.basePath = '/';
	const internalFolderReady = mkdir(site.internal.internalFolder, {
		recursive: true,
	});

	const genRoutes = async () => {
		await internalFolderReady;
		return generateRouter({
			template: join(__dirname, '../assets/routes.js.template'),
			site,
		});
	};

	const routesDone = genRoutes();
	const viteServer = await createViteServer({ dev, config, site });

	const app = new Koa();
	await routesDone;

	if (!dev) {
		await Promise.all([
			build({
				...viteProdConfig(config, site, false),
				configFile: false,
			}),
			build({
				...viteProdConfig(config, site, true),
				configFile: false,
			}),
		]);

		// const files = await glob(`${site.internal.snowpackFolder}/**/*`, {
		// 	nodir: true,
		// });
		// brotliify(files);
	}

	app.use(
		serve(join(site.internal.staticFolder, './public'), { index: false }),
	);

	if (!dev) {
		app.use(
			mount(
				serve(site.internal.viteFolder + '/client', {
					index: false,
					maxAge: dev ? undefined : 31536000,
				}),
			),
		);
	}

	app.use(async (ctx, next) => c2k(viteServer.middlewares)(ctx, next));

	if (!dev) {
		app.use(compress());
		// TODO: use a simpler html minifyer (previously koa html minifier was used)
		// app.use(
		// 	htmlMinify({
		// 		collapseWhitespace: true,
		// 	}),
		// );
	}

	app.use(
		ssr({
			devServer: viteServer,
			dev,
			site,
			config,
		}),
	);

	if (dev) {
		const watcher = chokidar.watch(
			join(site.internal.pagesFolder, pagePattern),
			{
				ignoreInitial: true,
			},
		);

		const listener = async (path: string) => {
			site.internal.log.info('updating routes:', path);

			genRoutes()
				.then(() => site.internal.log.info('successfully updated routes'))
				.catch(e => site.internal.log.error(`error updating routes`, e));
		};

		watcher.on('add', listener);
		watcher.on('remove', listener);
	}

	const server = new Koa();
	server.use(mount(site.basePath, app));
	return server;
};
