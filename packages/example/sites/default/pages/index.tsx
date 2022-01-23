import { createSP, Head, Link } from '@snowstorm/core';
import { useState } from 'react';
import styles from './index.module.css';

import './../components/lol';
asdf;
const { useSP: useStuff } = createSP('load-stuff', async () => ({ hi: 1 }), {
	type: 'dynamic',
	runOnClient: false,
});

export const Index = () => {
	const data = useStuff();
	const [title, setTitle] = useState('pog');

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<title>{title}</title>
				<link rel="canonical" href="http://mysite.com/example" />
			</Head>
			<input
				className={styles.lol}
				value={title}
				onChange={e => setTitle(e.target.value)}
			/>
			hi lol eadfs geht {data?.hi}
			<Link href="/zasdf">
				<a>hier</a>
			</Link>
		</>
	);
};
