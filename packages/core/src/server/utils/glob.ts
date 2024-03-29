import type { Options } from 'fast-glob';
import fastglob from 'fast-glob';
import normalizePath from 'normalize-path';

import { createRequire as topLevelCreateRequire } from 'module';
global.require = topLevelCreateRequire(import.meta.url);

const glob = async (glob: string, options?: Options) =>
	fastglob(normalizePath(glob), options);
export default glob;
