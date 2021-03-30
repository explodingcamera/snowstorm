import { loadConfig } from './config';

export const exportProject = async ({ path }: { path: string }) => {
	const config = await loadConfig(path);
};
