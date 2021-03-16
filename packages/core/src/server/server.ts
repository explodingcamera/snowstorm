import {
	createConfiguration,
	startServer,
	SnowpackUserConfig,
	logger,
	build,
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
import { generateRoutes, pagePattern } from './routes';
import { brotliify } from './brotliify.js';

// a bit hacky, but simplifies dev code a lot, since we can just reuse the client code here on the server
(global as any).$RefreshReg$ = () => undefined;
(global as any).$RefreshSig$ = () => () => undefined;

logger.level = 'silent';
logger.on('error', e => console.error(e));
logger.on('warn', e => console.error(e));
logger.on('info', e => console.error(e));
logger.on('debug', e => console.error(e));

export interface SnowstormConfig {
	test?: true;
}

const defaultConfig: SnowstormConfig = {};

export const start = async ({
	dev,
	path,
	config,
}: {
	dev: boolean;
	path: string;
	config?: SnowstormConfig;
}) => {
	const serverStart = performance.now();
	const cfg = { ...defaultConfig, ...config };

	const snowstormFolder = join(path, './.snowstorm');
	const snowpackFolder = join(snowstormFolder, './out');
	const internalFolder = join(snowstormFolder, './internal');
	const pagesFolder = join(path, './pages');
	const assetsFolder = join(__dirname, '../../assets');
	const clientFolder = join(__dirname, '../client');

	const configOverride: SnowpackUserConfig = {
		buildOptions: {
			out: snowpackFolder,
			metaUrlPath: '_snowstorm',
		},
		mount: {
			[assetsFolder]: '/',
			[clientFolder]: '/_snowstorm',
			[pagesFolder]: '/_snowstorm/pages',
			[internalFolder]: '/_snowstorm/internal',
		},
	};

	await mkdir(internalFolder, { recursive: true });
	await mkdir(snowpackFolder, { recursive: true });

	const genRoutes = async () =>
		generateRoutes({
			pagesFolder,
			internalFolder,
			template: join(__dirname, '../../assets/routes.js.template'),
		});

	await genRoutes();

	if (dev) {
		const watcher = chokidar.watch(join(pagesFolder, pagePattern), {
			ignoreInitial: true,
		});

		const listener = async (path: string) =>
			genRoutes()
				.then(() => console.log('successfully updated routes', path))
				.catch(e => console.error(`error updating routes: `, e));

		watcher.on('add', listener);
		watcher.on('remove', listener);
	} else {
		await build({
			config: createConfiguration(deepmerge(prodConfig, configOverride)),
			lockfile: null,
		});

		const files = await glob(`${snowpackFolder}/**/*`, { nodir: true });
		brotliify(files);
	}

	const app = new Koa();
	const configFinal = createConfiguration(deepmerge(devConfig, configOverride));
	const devServer = await startServer({
		config: configFinal,
		lockfile: null,
	});

	app.use(serveHMR({ devServer, dev }));
	app.use(serve(join(path, './public'), { index: false }));
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
			outputFolder: snowpackFolder,
			pagesFolder: pagesFolder,
			config: cfg,
		}),
	);

	app.listen(2000);

	console.log('>> listening on port 2000');
	console.log(`>> started in ${Math.round(performance.now() - serverStart)}ms`);
};
