declare module 'react-dom/server' {
	export function pipeToNodeWritable(
		node: any,
		writable: any,
		options: any,
	): any;
}
