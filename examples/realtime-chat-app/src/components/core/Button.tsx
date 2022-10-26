import { ComponentPropsWithoutRef } from 'react';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
	className?: string;
	withIcon?: boolean;
}

export default function Button({ children, className, withIcon = false, ...props }: ButtonProps) {
	return (
		<button
			{...props}
			className={`flex items-center justify-center rounded text-gray-700 text-primary-strong-light transition enabled:hover:bg-menu-bar-item-background-active-light dark:text-primary-strong-dark enabled:hover:dark:bg-menu-bar-item-background-active-dark [&>*]:shrink-0 [&>*]:grow-0
				${
					withIcon
						? 'aspect-square w-10 !rounded-full'
						: 'border border-text-muted-light px-4 py-2 dark:border-text-muted-dark'
				}
				${className ?? ''}
			`}
		>
			{children}
		</button>
	);
}
