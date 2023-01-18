import { ComponentPropsWithRef, ForwardedRef, forwardRef, useId } from 'react';
import { cn } from '../../helpers';

export interface SelectBoxProps extends ComponentPropsWithRef<'select'> {
	showError?: boolean;
	errorMessage?: string;
	fields: {
		id: string | number;
		value: string;
	}[];
	label?: string;
	className?: string;
	firstSelectionText?: string;
}
const SelectBox = forwardRef(
	(
		{
			fields,
			value,
			className,
			label,
			firstSelectionText,
			showError = false,
			errorMessage,
			...props
		}: SelectBoxProps,
		ref: ForwardedRef<HTMLSelectElement>
	) => {
		const id = useId();

		return (
			<div className={className}>
				<select
					id={id}
					value={value}
					className={cn(
						'block focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm sm:text-sm border-gray-300 rounded-md',
						showError ? 'border-red-600' : ''
					)}
					{...props}
				>
					{firstSelectionText ? (
						<option value="" className="text-gray-50">
							{firstSelectionText}
						</option>
					) : undefined}

					{fields.map(field => (
						<option value={field.id} key={field.id}>
							{field.value}
						</option>
					))}
				</select>
				{showError ? <small className="text-red-600">{errorMessage}</small> : undefined}
			</div>
		);
	}
);

export default SelectBox;
