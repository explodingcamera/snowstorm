import React, { useEffect, useState } from 'react';

export const Page = () => {
	const [count, setCount] = useState(0);
	useEffect(() => {
		const timeout = window.setInterval(() => setCount(c => c + 1), 1000);
		return () => clearInterval(timeout);
	});
	return <>hi {count}</>;
};
