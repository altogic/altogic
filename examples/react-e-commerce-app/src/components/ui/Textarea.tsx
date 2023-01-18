import { ComponentPropsWithRef, ForwardedRef, forwardRef, useId } from 'react';
import { cn } from '../../helpers';

export interface TextAreaProps extends ComponentPropsWithRef<'textarea'> {
	showError?: boolean;
	errorMessage?: string;
	className?: string;
}
const TextArea = forwardRef(
	(
		{ className, rows, cols, showError = false, errorMessage, ...props }: TextAreaProps,
		ref: ForwardedRef<HTMLTextAreaElement>
	) => {
		const id = useId();

		return (
			<div className={className}>
				<textarea
					ref={ref}
					id={id}
					rows={rows}
					cols={cols}
					className={cn(
						'shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md',
						showError ? 'border-red-600' : ''
					)}
					{...props}
				/>
				{showError ? <small className="text-red-600">{errorMessage}</small> : undefined}
			</div>
		);
	}
);

export default TextArea;
