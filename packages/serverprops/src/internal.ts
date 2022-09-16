import type { SPOptions } from './server-props';

const serverProps: Record<string, any> = {};
const spFuncs: Array<{
	name: string;
	run: () => Promise<unknown>;
	options: SPOptions;
}> = [];

export const hydrateSPs = () => {
	const props = document.getElementById('__serverprops')?.innerHTML;
	if (!props) return false;
	try {
		for (const [key, value] of Object.entries(JSON.parse(props))) {
			serverProps[key] = value;
		}
	} catch (error: unknown) {
		console.error(error);
		if (error instanceof Error) return error;
	}

	return true;
};

export const processSPs = async () => {
	const spnames = spFuncs.map(name => name);
	if (new Set(spnames).size !== spnames.length)
		throw new Error('error processing server props: duplicate name');

	const promises = spFuncs.map(async ({ name, run }) =>
		run().then(res => ({ res, name })),
	);

	for await (const { name, res } of promises) serverProps[name] = res;
	return collectProps();
};

export const collectProps = () => {
	try {
		return JSON.stringify(serverProps);
	} catch (error: unknown) {
		if (error instanceof Error)
			throw new Error(`Error while serializing server props: ${error.message}`);
	}
};

export const registerSP = (
	name: string,
	run: () => Promise<unknown>,
	options: SPOptions,
) => {
	spFuncs.push({ name, run, options });
};

export const getServerProp = (name: string) => serverProps?.[name];
