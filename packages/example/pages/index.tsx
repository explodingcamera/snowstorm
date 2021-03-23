import React from 'react';
import { createSP } from '@snowstorm/hooks';

const { useSP: useStuff } = createSP('load-stuff', async () => ({ hi: 1 }), {
	type: 'dynamic',
	runOnClient: false,
});

export const Index = () => {
	const data = useStuff();

	return <>hi lol eadfs geht {data?.hi}</>;
};
