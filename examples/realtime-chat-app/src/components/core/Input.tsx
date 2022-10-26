import { forwardRef, ComponentPropsWithRef, ForwardedRef } from 'react';

export interface InputProps extends ComponentPropsWithRef<'input'> {
	className?: string;
}

const Input = forwardRef(({ className, ...props }: InputProps, ref: ForwardedRef<HTMLInputElement>) => (
	<input
		ref={ref}
		className={`ring-blue-800, w-full rounded border-2 border-gray-500 px-3 py-2 text-gray-600 outline-none focus:border-black ${
			className ?? ''
		}`}
		{...props}
	/>
));

export default Input;
