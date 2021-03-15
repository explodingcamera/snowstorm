import { Command, flags } from '@oclif/command';

import { startServer } from '@snowstorm/core';
export default class Dev extends Command {
	static description = 'Start the dev server';

	static examples = [`$ snowstorm dev`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	async run() {
		const { args, flags } = this.parse(Dev);
		void startServer({ path: process.cwd(), dev: true });
	}
}
