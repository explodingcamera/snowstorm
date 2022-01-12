const pageExtensions = ['js', 'mjs', 'jsx', 'ts', 'tsx', 'mdx', 'md'];

export const fileIsPage = (key: string) => {
	const parts = key.split('.');
	if (parts.length === 0) return false;
	return pageExtensions.includes('.' + parts[parts.length - 1]);
};

export const pageGlob = `/**/*.{${pageExtensions.join(',')}}`;
