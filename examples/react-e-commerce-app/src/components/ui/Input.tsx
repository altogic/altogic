import { ComponentPropsWithRef, ForwardedRef, forwardRef } from 'react';
import { cn } from '../../helpers';

export interface InputProps extends ComponentPropsWithRef<'input'> {
	showError?: boolean;
	errorMessage?: string;
	className?: string;
}
const Input = forwardRef(
	(
		{ type = 'text', className, showError = false, errorMessage, ...props }: InputProps,
		ref: ForwardedRef<HTMLInputElement>
	) => {
		return (
			<div>
				<input
					ref={ref}
					type={type}
					className={cn(
						'block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md',
						showError ? 'border-red-600' : '',
						className
					)}
					{...props}
				/>
				{showError ? <small className="text-red-600">{errorMessage}</small> : undefined}
			</div>
		);
	}
);

export default Input;
