import { Command, flags } from '@oclif/command';

export default class Build extends Command {
	static description = 'Build a static version of you application';

	static examples = [`$ snowstorm build`];

	static flags: Record<string, any> = {
		help: flags.help({ char: 'h' }),
	};

	async run() {
		const { args, flags } = this.parse(Build);
		this.log(process.cwd());
	}
}
