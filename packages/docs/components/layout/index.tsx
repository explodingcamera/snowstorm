import React, { FC } from 'react';
import '@snowstorm/core/base.css';

export const Layout: FC<{ className?: string }> = ({ children, className }) => (
	<div className={className}>{children}</div>
);
