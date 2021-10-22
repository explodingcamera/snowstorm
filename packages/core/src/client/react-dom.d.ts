import '@types/react-dom/server';

declare module 'react-dom/server' {
	export function renderToPipeableStream(node: any, options: any): any;
}
