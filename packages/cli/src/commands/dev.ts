import { Command, flags } from '@oclif/command';

import { startServer } from '@snowstorm/core/server';
export default class Dev extends Command {
	static description = 'Start the dev server';

	static examples = [`$ snowstorm dev`];

	static flags: Record<string, any> = {
		help: flags.help({ char: 'h' }),
		clearCache: flags.boolean({
			default: false,
			char: 'C',
			hidden: true,
		}),
	};

	async run() {
		const { args, flags } = this.parse(Dev);

		void startServer({
			path: process.cwd(),
			dev: true,
			clearCache: flags.clearCache as boolean,
		});
	}
}
