import { isString } from './is-string';

export const stripFileExtension = (str: string) => {
	const split = RegExp(/(.*)\.(.*)/).exec(str);
	return split ? split[1] : undefined;
};

export const stripFileExtensions = (files: string[]) =>
	files.map(r => stripFileExtension(r)).filter(isString);
