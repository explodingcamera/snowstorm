import vm from 'vm';

async function linker(specifier: string, referencingModule: string) {
	if (specifier === 'foo') {
		// @ts-expect-error https://nodejs.org/api/vm.html#vm_class_vm_module
		return new vm.SourceTextModule(
			`
		// The "secret" variable refers to the global variable we added to
		// "contextifiedObject" when creating the context.
		export default secret;
	  `,
			// @ts-expect-error https://nodejs.org/api/vm.html#vm_class_vm_module
			{ context: referencingModule.context },
		);

		// Using `contextifiedObject` instead of `referencingModule.context`
		// here would work as well.
	}

	throw new Error(`Unable to resolve dependency: ${specifier}`);
}

export const importFromString = async (code: string) => {
	const configContext = vm.createContext();
	// @ts-expect-error https://nodejs.org/api/vm.html#vm_class_vm_module
	const mod = new vm.SourceTextModule(code, { context: configContext });

	await mod.link(linker);
	await mod.evaluate();
};
