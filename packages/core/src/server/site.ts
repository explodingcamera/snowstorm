import Koa from 'koa';
import c2k from 'koa-connect';
import mount from 'koa-mount';
import serve from 'koa-static';
import compress from 'koa-compress';
import chokidar from 'chokidar';

import { build, createServer, InlineConfig, Plugin, PluginOption } from 'vite';

import {
	SnowstormConfigInternal,
	SnowstormSiteConfigInternal,
} from './config.js';
import react from '@vitejs/plugin-react';

import { dirname, join } from 'node:path';
import { mkdir } from 'node:fs/promises';

import { getFreePort } from './utils/free-port.js';
import { ssr } from './ssr.js';
import { generateRouter } from './router/index.js';
import { fileURLToPath } from 'node:url';
import deepmerge from 'deepmerge';
import { pageGlob } from './utils/is-page.js';
import glob from './utils/glob.js';
import { brotliify } from './utils/brotliify.js';
import normalizePath from 'normalize-path';

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
): InlineConfig => {
	const res: InlineConfig = {
		root: config.internal.snowstormAssetsFolder,
		cacheDir: join(site.internal.viteFolder, './.vite'),
		configFile: false,
		plugins: [],
		ssr: {
			noExternal: [
				/@snowstorm/,
				...((config?.site?.build?.noExternal ?? []) as any),
				...((site?.build?.noExternal ?? []) as any),
			],
		},
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
				_snowstorm: normalizePath(config.internal.snowstormClientFolder),
				'_snowstorm-internal': normalizePath(site.internal.internalFolder),
				'_snowstorm-pages': normalizePath(site.internal.pagesFolder),
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
	};

	const defaultPlugins =
		(config.site.build?.plugins as Array<PluginOption | PluginOption[]>) || [];

	res?.plugins?.push(
		// snowstorm's default plugins
		...[
			react({ jsxRuntime: 'classic' }),
			snowstormCollectModules(site.internal.baseFolder),
		],
		// default plugins
		...defaultPlugins,
	);

	// site specific plugins
	// (we don't want to include the default site plugins twice)
	if (
		config.internal.sitesFolder &&
		site.pagesFolder.startsWith(config.internal.sitesFolder)
	) {
		res?.plugins?.push(...(site.build.plugins || []));
	}

	return res;
};

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
		appType: 'custom',
		server: { middlewareMode: true, hmr: { port: hmrPort } },
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
	await mkdir(site.internal.internalFolder, {
		recursive: true,
	});

	const genRoutes = async () =>
		generateRouter({
			template: join(__dirname, '../assets/routes.js.template'),
			site,
		});

	await genRoutes();
	const viteServer = await createViteServer({ dev, config, site });

	const app = new Koa();

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

		const files = await glob(`${site.internal.viteFolder}/**/*`);
		brotliify(files);
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
		app.use(
			compress({
				threshold: 2048,
				br: {},
			}),
		);
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
		const watcher = chokidar.watch(join(site.internal.pagesFolder, pageGlob), {
			ignoreInitial: true,
		});

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
