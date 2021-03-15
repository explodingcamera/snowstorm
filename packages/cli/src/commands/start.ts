import { Command, flags } from '@oclif/command';
import { startServer } from '@snowstorm/core';

export default class Start extends Command {
	static description = 'Start the production server';

	static examples = [`$ snowstorm start`];

	static flags = {
		help: flags.help({ char: 'h' }),
	};

	async run() {
		const { args, flags } = this.parse(Start);
		void startServer({ path: process.cwd(), dev: false });
	}
}
