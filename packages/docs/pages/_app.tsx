import { SnowstormCustomApp } from '@snowstorm/core/types';

const App: SnowstormCustomApp = ({ children, exports }) => {
	console.log(exports && Object.keys(exports));

	return <div>{children}</div>;
};

export default App;
