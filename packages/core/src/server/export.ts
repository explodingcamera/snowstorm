import { loadConfig } from './config';
import { generate } from 'staticgen-node';
import { getFreePort } from './utils/free-port';

export const exportProject = async ({ path }: { path: string }) => {
	const config = await loadConfig(path);
	config.server.port = await getFreePort();
	const port = config.server.port;

	generate({
		pages: [],
		chdir: config.internal.projectPath,
		directory: config.export.outDir,
		url: `localhost:${port}`,
	});
};
