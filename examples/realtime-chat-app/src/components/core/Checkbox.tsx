import { useId, ChangeEvent, ReactNode, useState, useEffect } from 'react';
import { GoCheck } from 'react-icons/go';

interface CheckboxProps {
	label?: string;
	defaultChecked?: boolean;
	value?: string;
	className?: string;
	name?: string;
	children?: ReactNode;
	required?: boolean;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
}
export default function Checkbox({
	label,
	defaultChecked,
	onChange,
	value,
	name,
	children,
	className,
	required,
}: CheckboxProps) {
	const [checked] = useState(defaultChecked);
	const checkboxId = useId();

	return (
		<label
			className={`inline-flex cursor-pointer items-center gap-2 [&>*]:shrink-0 [&>*]:grow-0 ${className ?? ''}`}
			htmlFor={checkboxId}
		>
			<input
				value={value}
				onChange={onChange}
				className="peer hidden"
				type="checkbox"
				id={checkboxId}
				checked={checked}
				required={required}
				name={name}
			/>
			<span className="grid aspect-square h-5 w-5 place-items-center rounded border-2 border-gray-500 text-transparent transition peer-checked:border-icon-bright-highlight-light peer-checked:text-icon-bright-highlight-light dark:peer-checked:text-icon-bright-highlight-dark">
				<GoCheck className=" fill-current" />
			</span>
			{label && <span className="select-none">{label}</span>}
			{children}
		</label>
	);
}
