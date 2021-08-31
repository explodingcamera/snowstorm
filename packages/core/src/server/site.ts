import Koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import compress from 'koa-compress';
import htmlMinify from 'koa-html-minifier';
import chokidar from 'chokidar';

import { createServer } from 'vite';

// import { prodConfig, devConfig } from './snowpack-config';

import { SnowstormConfigInternal, SnowstormInternalSiteConfig } from './config';

import { join } from 'path';
import glob from 'glob-promise';
// import deepmerge from 'deepmerge';
import { mkdir } from 'fs/promises';

import { getFreePort } from './utils/free-port';
import { brotliify } from './utils/brotliify';

import { ssr } from './ssr';
// import { serveHMR } from './hmr';
import { generateRouter, pagePattern } from './router';

const createViteServer = async ({
	dev,
	config,
	site,
}: {
	dev: boolean;
	config: SnowstormConfigInternal;
	site: SnowstormInternalSiteConfig;
}) => {
	const hmrPort = (dev && (await getFreePort())) || 0;
	const { snowstormAssetsFolder, snowstormClientFolder } = config.internal;

	const server = await createServer({
		// any valid user config options, plus `mode` and `configFile`
		configFile: false,
		server: { middlewareMode: 'html', hmr: { port: hmrPort } },
		root: config.internal.rootFolder,
		// @ts-expect-error - ssr is considered in alpha, so not yet exposed by Vite
		ssr: { noExternal: ['wouter'] },
		build: {
			rollupOptions: {
				input: snowstormClientFolder + '/index.js',
			},
		},
		publicDir: snowstormAssetsFolder,
		resolve: {
			alias: {
				_snowstorm: snowstormClientFolder,
				'_snowstorm-internal': site.internal.internalFolder,
				'_snowstorm-pages': site.internal.pagesFolder,
			},
		},
	});

	// const configOverride: SnowpackUserConfig = {
	// 	root: config.internal.rootFolder,
	// 	buildOptions: {
	// 		out: site.internal.snowpackFolder,
	// 		metaUrlPath: '_snowstorm',
	// 	},
	// 	devOptions: {
	// 		hmrPort,
	// 	},
	// 	mount: {
	// 		[snowstormAssetsFolder]: `/`,
	// 		[site.internal.pagesFolder]: `/_snowstorm/pages`,
	// 		[snowstormClientFolder]: `/_snowstorm/internal`,
	// 		[site.internal.internalFolder]: `/_snowstorm/internal`,
	// 	},
	// };

	// if (site.build.sass) {
	// 	configOverride.plugins?.push([
	// 		require.resolve('@snowpack/plugin-sass'),
	// 		typeof site.build.sass === 'object' ? site.build.sass : {},
	// 	]);
	// }

	// if (site.build.postcss) {
	// 	configOverride.plugins?.push([
	// 		require.resolve('@snowpack/plugin-postcss'),
	// 		typeof site.build.postcss === 'object' ? site.build.postcss : {},
	// 	]);
	// }

	// const snowpackConfig = createConfiguration(
	// 	deepmerge(dev ? devConfig : prodConfig, configOverride),
	// );

	return server;
};

export const startSite = async ({
	dev,
	config,
	site,
}: {
	dev: boolean;
	config: SnowstormConfigInternal;
	site: SnowstormInternalSiteConfig;
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

	// if (!dev) {
	// 	await routesDone;
	// 	await build({
	// 		config: snowpackConfig,
	// 		lockfile: null,
	// 	});

	// 	const files = await glob(`${site.internal.snowpackFolder}/**/*`, {
	// 		nodir: true,
	// 	});

	// 	brotliify(files);
	// }

	const app = new Koa();
	await routesDone;

	app.use(
		serve(join(site.internal.staticFolder, './public'), { index: false }),
	);
	app.use(serve(config.internal.snowstormAssetsFolder, { index: false }));
	app.use(
		mount(
			serve(site.internal.snowpackFolder, {
				index: false,
				maxAge: dev ? undefined : 31536000,
			}),
		),
	);

	if (!dev) {
		app.use(compress());
		app.use(
			htmlMinify({
				collapseWhitespace: true,
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
