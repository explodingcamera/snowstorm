import { SPOptions } from './server-props';

const serverProps: Record<string, string> = {};
const spFuncs: Array<{
	name: string;
	run: () => Promise<unknown>;
	options: SPOptions;
}> = [];

export const processSPs = async () => {
	console.log('processing sps');

	const spnames = spFuncs.map(name => name);
	if (new Set(spnames).size !== spnames.length) {
		throw new Error('error processing server props: duplicate name');
	}

	console.log('sps:', spFuncs);

	const promises = spFuncs.map(async ({ name, run }) =>
		run().then(res => ({ res, name })),
	);

	for await (const { name, res } of promises) {
		try {
			serverProps[name] = JSON.stringify(res);
		} catch (error: unknown) {
			if (error instanceof Error)
				throw new Error(
					`Error while serializing server prop: ${name}: ${error.message}`,
				);
		}
	}
};

export const registerSP = (
	name: string,
	run: () => Promise<unknown>,
	options: SPOptions,
) => {
	// @ts-expect-error import.meta.env.SSR exists in the environments expected to use this package
	if (import.meta.env?.SSR === false && !options.runOnClient) {
		return;
	}

	console.log('registering ', name);

	// TODO: depending on the type add for prerender/whatever
	spFuncs.push({ name, run, options });
};

export const collectProps = () => serverProps;

export const getServerProp = (name: string) => {
	try {
		return JSON.parse(serverProps?.[name]);
	} catch (error: unknown) {
		if (error instanceof Error)
			throw new Error(
				`Error while deserializing server prop: ${name}: ${error.message}`,
			);
	}

	return undefined;
};
