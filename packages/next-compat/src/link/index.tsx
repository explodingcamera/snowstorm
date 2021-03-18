import React from 'react';
import { Link as WLink } from 'wouter';

export const Link = ({
	children,
	href,
	as = undefined,
	replace = false,
	prefetch,
	...rest
}: {
	href: string;
	as: undefined;
	replace: false;
	prefetch: boolean;
	children: React.ReactNode;
}) => {
	return (
		<WLink href={href} {...rest}>
			{children}
		</WLink>
	);
};
