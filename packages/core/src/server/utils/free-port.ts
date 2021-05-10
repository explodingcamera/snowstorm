import net from 'net';

export async function getFreePort(): Promise<number> {
	return new Promise((resolve, reject) => {
		const server = net.createServer();
		let calledFn = false;

		server.on('error', err => {
			server.close();

			if (calledFn) return;
			calledFn = true;
			reject(err);
		});

		server.listen(0, () => {
			const address = server?.address?.();
			const port = typeof address === 'object' ? address?.port : undefined;
			server.close();

			if (calledFn) return;
			calledFn = true;

			if (port) return resolve(port);
			reject(new Error("Unable to get the server's given port"));
		});
	});
}
