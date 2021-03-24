import React from 'react';
import { createSP, Head } from '@snowstorm/core';

const { useSP: useStuff } = createSP('load-stuff', async () => ({ hi: 1 }), {
	type: 'dynamic',
	runOnClient: false,
});

export const Index = () => {
	const data = useStuff();

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<title>My Title</title>
				<link rel="canonical" href="http://mysite.com/example" />
			</Head>
			hi lol eadfs geht {data?.hi}
		</>
	);
};
