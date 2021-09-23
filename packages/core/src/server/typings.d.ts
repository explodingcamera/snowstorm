declare module '*.json';

declare module 'website-scraper/lib/filename-generator/by-site-structure.js' {
	export default function bySiteStructureFilenameGenerator(
		resource,
		{ defaultFilename },
	): string;
}
