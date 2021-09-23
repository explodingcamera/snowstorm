import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { startServer } from '@snowstorm/core/server';
import { exportProject } from '@snowstorm/core/server/export';

yargs(hideBin(process.argv))
	.scriptName('snowstorm')
	.command(
		'dev',
		'start the development server',
		yargs =>
			yargs
				.usage('snowstorm dev')
				.option('clear', { alias: 'c', boolean: true, default: false })
				.option('debug', { boolean: true, default: false, hidden: true }),
		flags => {
			startServer({
				path: process.cwd(),
				dev: true,
				clearCache: flags.clearCache,
				debug: flags.debug,
			});
		},
	)
	.command(
		'start',
		'start the server',
		yargs =>
			yargs
				.usage('snowstorm start')
				.option('clear', { alias: 'c', boolean: true, default: false })
				.option('debug', { boolean: true, default: false, hidden: true }),
		flags => {
			startServer({
				path: process.cwd(),
				clearCache: flags.clearCache,
				debug: flags.debug,
			});
		},
	)
	// exportProject
	.command(
		'export',
		'export the project',
		yargs =>
			yargs
				.usage('snowstorm export')
				.option('clear', { alias: 'c', boolean: true, default: false })
				.option('debug', { boolean: true, default: false, hidden: true }),
		flags => {
			exportProject({
				path: process.cwd(),
				clearCache: flags.clearCache,
				debug: flags.debug,
			});
		},
	)
	.help()
	.parse();
