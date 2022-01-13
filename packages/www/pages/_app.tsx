import { SnowstormCustomAppProps } from '@snowstorm/core/types';
import { Layout } from '../components/layout';
import { PageMeta } from '../types';

const App = ({ children, exports }: SnowstormCustomAppProps) => (
	<Layout meta={exports?.meta as PageMeta | undefined}>
		<>
			{exports?.title && <h1>{exports.title}</h1>}
			{children}
		</>
	</Layout>
);

export default App;
