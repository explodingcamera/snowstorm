declare module 'react-dom/server.node' {
	export function pipeToNodeWritable(
		node: any,
		writable: any,
		options: any,
	): any;
}
