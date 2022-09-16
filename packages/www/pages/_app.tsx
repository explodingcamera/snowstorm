import type { SnowstormCustomAppProps } from '@snowstorm/core';
import { Layout } from '../components/layout';
import type { PageMeta } from '../types';

const App = ({ children, exports }: SnowstormCustomAppProps) => (
	<Layout meta={exports?.meta as PageMeta | undefined}>
		<>
			{exports?.title && <h1>{exports.title}</h1>}
			{children}
		</>
	</Layout>
);

export default App;
