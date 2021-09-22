import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { startServer } from '@snowstorm/core/server';

yargs(hideBin(process.argv))
	.scriptName('snowstorm')
	.command(
		'dev',
		'start the development server',
		yargs =>
			yargs
				.usage('snowstorm dev')
				.option('clear', { alias: 'c', boolean: true, default: false }),
		flags => {
			startServer({
				path: process.cwd(),
				dev: true,
				clearCache: flags.clearCache,
			});
		},
	)
	.command(
		'start',
		'start the server',
		yargs =>
			yargs
				.usage('snowstorm start')
				.option('clear', { alias: 'c', boolean: true, default: false }),
		flags => {
			startServer({
				path: process.cwd(),
				dev: true,
				clearCache: flags.clearCache,
			});
		},
	)
	.command('export')
	.help()
	.parse();
