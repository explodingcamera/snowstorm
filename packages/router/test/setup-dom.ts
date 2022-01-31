import 'global-jsdom/register';

const backup = console.error;
(console.error as any) = (msg: string, ...msgs: unknown[]) => {
	const supressedWarnings = [
		'Warning: ReactDOM.render is no longer supported in React 18.',
	];

	if (!supressedWarnings.some(entry => msg.includes(entry))) {
		backup.apply(console, [msg, ...msgs]);
	}
};
