import { ReactNode } from 'react';

interface CardProps {
	children: ReactNode;
	className?: string;
}

export default function Card({ children, className, ...props }: CardProps) {
	return (
		<div className={`rounded-2xl rounded-md bg-white p-6 shadow-xl sm:p-8 ${className ?? ''}`} {...props}>
			{children}
		</div>
	);
}
