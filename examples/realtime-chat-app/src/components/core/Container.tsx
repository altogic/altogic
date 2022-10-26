import { ReactNode } from 'react';

interface ContainerProps {
	children: ReactNode;
	className?: string;
}
export default function Container({ children, className, ...props }: ContainerProps) {
	return (
		<div className={`container mx-auto grid max-h-screen lg:p-4 ${className ?? ''}`} {...props}>
			{children}
		</div>
	);
}
