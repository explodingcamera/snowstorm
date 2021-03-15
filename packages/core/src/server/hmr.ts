import { Middleware } from 'koa';
import { SnowpackDevServer } from 'snowpack';

export const serveHMR = ({
	devServer,
	dev,
}: {
	devServer: SnowpackDevServer;
	dev: boolean;
}): Middleware => async (ctx, next) => {
	// serve hmr & dev code in dev mode
	if (
		dev &&
		(ctx.path.startsWith('/dist') || ctx.path.startsWith('/_snowpack'))
	) {
		const resp = await devServer.loadUrl(ctx.path);
		ctx.body = resp.contents;
		ctx.set('Content-Type', resp.contentType.toString());
		return;
	}

	return next();
};
