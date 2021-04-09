import React from 'react';
import { getServerProp, registerSP } from './internal';

export interface SSROptionsBuildTime {
	type: 'dynamic';
	runOnClient: boolean;
}
export interface SSROptionsRunTime {
	type: 'static';
	runOnClient: boolean;
}

export type SPOptions = SSROptionsBuildTime | SSROptionsRunTime;

export interface SSRHocProps<T> {
	ssr: T;
}

/**
 * createSP creates a new ServerProp instance that can be consumed using either the returned useSP hook or  withSP higher-order-component.
 *
 * NOTE: The async function's result needs to be convertable to JSON.
 * @example
 * ```
 * const { useSP: useStuff } = createSP('load-stuff', async () => Promise.resolve('foo'), {
 * 	type: 'dynamic',
 * 	runOnClient: false,
 * });
 * ```
 * @param name a unique name for this server prop
 * @param run the async function that is run to generate the server prop
 */
export function createSP<T>(
	name: string,
	run: () => Promise<T>,
	options: SPOptions,
) {
	if (options.type === 'static')
		throw new Error('Only dynamic serverporps are not supported yet.');
	if (options.runOnClient)
		throw new Error("Clientside Serverprop executions isn't supported yet.");
	registerSP(name, run, options);

	function useSP(): T | undefined | null {
		const serverdata: T = getServerProp(name);
		return serverdata && serverdata;
	}

	function withSP<P extends SSRHocProps<T>, T>(
		Component: React.ComponentType<P>,
	): React.ComponentType<P> {
		return props => {
			const ssr = useSP();
			return <Component {...props} ssr={ssr} />;
		};
	}

	return { useSP, withSP };
}
