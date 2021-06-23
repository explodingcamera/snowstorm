import React from 'react';

declare module '.' {
	function pipeToNodeWritable(
		node: React.Node,
		writable: any,
		options: any,
	): any;
}
