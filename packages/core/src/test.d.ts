declare module 'esmock' {
	export function mock(modulePath: string, mocks: Record<string, any>): any;
	export default mock;
}
