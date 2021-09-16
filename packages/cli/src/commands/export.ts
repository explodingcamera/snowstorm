import { Command, flags } from '@oclif/command';

import { exportProject } from '@snowstorm/core/server/export';
export default class Export extends Command {
	static description = 'Export';

	static examples = [`$ snowstorm export`];

	static flags: Record<string, any> = {
		help: flags.help({ char: 'h' }),
	};

	async run() {
		const { args, flags } = this.parse(Export);

		void exportProject({
			path: process.cwd(),
		});
	}
}
