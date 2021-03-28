import { Command, flags } from '@oclif/command';

import { startServer } from '@snowstorm/core/server';
export default class Export extends Command {
	static description = 'Export';

	static examples = [`$ snowstorm export`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	async run() {
		const { args, flags } = this.parse(Export);

		void startServer({
			path: process.cwd(),
			dev: true,
		});
	}
}
