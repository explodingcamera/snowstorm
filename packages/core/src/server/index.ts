import {
	createConfiguration,
	startServer,
	SnowpackUserConfig,
	logger,
	build,
	clearCache,
} from 'snowpack';

import { join } from 'path';
import { mkdir } from 'fs/promises';
import { performance } from 'perf_hooks';
import chokidar from 'chokidar';

import Koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import compress from 'koa-compress';
import htmlMinify from 'koa-html-minifier';
import deepmerge from 'deepmerge';
import glob from 'glob-promise';

import * as devConfig from './snowpack.config.js';
import * as prodConfig from './snowpack.config.prod.js';

import { serveHMR } from './hmr';
import { ssr } from './ssr';
import { generateRouter, pagePattern } from './router';
import { brotliify } from './brotliify.js';
import { loadConfig } from './config.js';
import { getFreePort } from './utils/free-port.js';
import { SnowstormConfigInternal } from './config';

logger.level = 'silent';
logger.on('error', e => console.error(e));
logger.on('warn', e => console.error(e));
logger.on('info', e => console.error(e));
logger.on('debug', e => console.error(e));

export const start = async ({
	dev,
	path,
	clearSnowpackCache,
	overrideConfig,
}: {
	dev: boolean;
	path: string;
	clearSnowpackCache?: boolean;
	overrideConfig?: SnowstormConfigInternal;
}) => {
	const serverStart = performance.now();

	const config = overrideConfig ? overrideConfig : await loadConfig(path);

	if (clearSnowpackCache) await clearCache();
	if (dev) config.server.basePath = '/';

	const {
		snowpackFolder,
		internalFolder,
		pagesFolder,
		assetsFolder,
		clientFolder,
	} = config.internal;

	const hmrPort = (dev && (await getFreePort())) || 0;

	const configOverride: SnowpackUserConfig = {
		buildOptions: {
			out: snowpackFolder,
			metaUrlPath: '_snowstorm',
		},
		devOptions: {
			hmrPort,
		},
		mount: {
			[assetsFolder]: `/`,
			[clientFolder]: `/_snowstorm`,
			[pagesFolder]: `/_snowstorm/pages`,
			[internalFolder]: `/_snowstorm/internal`,
		},
	};

	const internalFolderReady = mkdir(internalFolder, { recursive: true });
	const genRoutes = async () => {
		await internalFolderReady;
		return generateRouter({
			template: join(__dirname, '../assets/routes.js.template'),
			config,
		});
	};

	const routesDone = genRoutes();
	const snowpackConfig = createConfiguration(
		deepmerge(dev ? devConfig : prodConfig, configOverride),
	);

	// important! no leading slashes: https://github.com/snowpackjs/snowpack/issues/3111#issuecomment-816578171
	snowpackConfig.buildOptions.baseUrl = '';

	if (!dev) {
		await routesDone;

		await build({
			config: snowpackConfig,
			lockfile: null,
		});

		const files = await glob(`${snowpackFolder}/**/*`, { nodir: true });
		brotliify(files);
	}

	const app = new Koa();
	const [devServer] = await Promise.all([
		startServer(
			{
				config: snowpackConfig,
				lockfile: null,
			},
			{ isDev: dev, isWatch: dev },
		),
		routesDone,
	]);

	app.use(serveHMR({ devServer, dev }));
	app.use(serve(join(path, './public'), { index: false }));
	app.use(serve(assetsFolder, { index: false }));
	app.use(
		mount(
			serve(snowpackFolder, {
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
			devServer,
			dev,
			config,
		}),
	);

	const port = dev ? config.devServer.port : config.server.port;

	const server = new Koa();
	server.use(mount(config.server.basePath, app));

	const listening = new Promise<void>(resolve => {
		server.listen(port, () => resolve());

		console.log(
			`>> listening on http://localhost:${port}${config.server.basePath}`,
		);
	});

	if (dev) {
		console.log(`>> started hmr server on ws://localhost:${hmrPort}`);

		const watcher = chokidar.watch(join(pagesFolder, pagePattern), {
			ignoreInitial: true,
		});

		const listener = async (path: string) =>
			genRoutes()
				.then(() => console.log('successfully updated routes', path))
				.catch(e => console.error(`error updating routes: `, e));

		watcher.on('add', listener);
		watcher.on('remove', listener);
	}

	console.log(`>> started in ${Math.round(performance.now() - serverStart)}ms`);
	await listening;
};
