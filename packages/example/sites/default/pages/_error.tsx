import React from 'react';

const ErrorComponent = ({ status }: { status: number }) => (
	<h1>Something went wrong. {status}</h1>
);
export default ErrorComponent;
