import React, { useState } from 'react';
import { createSP, Head, Link } from '@snowstorm/core';

console.log(createSP);


// const { useSP: useStuff } = createSP('load-stuff', async () => ({ hi: 1 }), {
// 	type: 'dynamic',
// 	runOnClient: false,
// });

export const Index = () => {
	// const data = useStuff  ();
	const [title, setTitle] = useState('pog');

	return (
		<>
			{/* <Head>
				<meta charSet="utf-8" />
				<title>{title}</title>
				<link rel="canonical" href="http://mysite.com/example" />
			</Head>
			<input value={title} onChange={e => setTitle(e.target.value)} />
			hi lol eadfs geht {data?.hi}
			<Link href="/zasdf">
				<a>hier</a>
			</Link> */}
		</>
	);
};
