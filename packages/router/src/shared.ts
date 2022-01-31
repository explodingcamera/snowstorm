export type LocationHook = (options?: {
	base?: Path;
}) => [Path, (to: Path, options?: { replace?: boolean }) => void];
export type Path = string;
