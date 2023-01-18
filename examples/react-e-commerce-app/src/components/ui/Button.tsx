import { VariantPropsOf, variantProps } from 'classname-variants/react';
import { Link } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';

const buttonProps = variantProps({
	base: 'inline-flex overflow-hidden items-center enabled:shadow-sm [&:disabled]:cursor-not-allowed justify-center border border-transparent transition rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 relative [&:disabled]:opacity-60',
	variants: {
		size: {
			small: 'px-2 py-1 text-xs',
			medium: 'px-4 py-2 text-base'
		},
		variant: {
			primary: 'text-white bg-indigo-700 [&:not(:disabled):hover]:bg-indigo-800 focus:ring-indigo-500',
			secondary: 'text-indigo-700 bg-indigo-100 [&:not(:disabled):hover]:bg-indigo-200 focus:ring-indigo-400',
			white: 'text-gray-700 bg-white border border-gray-300 [&:not(:disabled):hover]:bg-gray-50 focus:ring-gray-400',
			danger: 'text-white bg-red-600 [&:not(:disabled):hover]:bg-red-700 focus:ring-red-500'
		},
		rounded: {
			full: 'rounded-full',
			sm: 'rounded-sm',
			md: 'rounded-md',
			lg: 'rounded-lg',
			none: 'rounded-none'
		},
		full: {
			true: 'w-full'
		}
	},
	defaultVariants: {
		size: 'medium',
		variant: 'primary',
		rounded: 'md'
	}
});

type Props = {
	loading?: boolean;
	as?: 'button' | 'link' | 'label';
	href?: string;
	target?: '_blank' | '_self' | '_parent' | '_top';
} & JSX.IntrinsicElements['button'] &
	JSX.IntrinsicElements['a'] &
	JSX.IntrinsicElements['label'] &
	VariantPropsOf<typeof buttonProps>;

export default function Button({ loading, as = 'button', href, children, target, ...props }: Props) {
	if (as === 'link') {
		if (!href) throw new Error('href prop is required for link buttons');
		return (
			// @ts-ignore
			<Link to={href} {...buttonProps(props)}>
				{children}
			</Link>
		);
	}
	if (as === 'label') {
		return (
			<label {...buttonProps(props)}>
				{children}
				{loading ? (
					<TailSpin
						wrapperClass="absolute inset-0 flex items-center justify-center bg-white/30"
						color="#fff"
						ariaLabel="tail-spin-loading"
						height="80%"
						radius="1"
					/>
				) : undefined}
			</label>
		);
	}
	return (
		<button disabled={loading} {...buttonProps(props)}>
			{children}
			{loading && (
				<TailSpin
					wrapperClass="absolute inset-0 flex items-center justify-center bg-white/30"
					color="#fff"
					ariaLabel="tail-spin-loading"
					height="80%"
					radius="1"
				/>
			)}
		</button>
	);
}
