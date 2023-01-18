import Button from './ui/Button';
import { FormEvent, useEffect, useId, useRef } from 'react';
import Input from './ui/Input';
import Modal from './ui/Modal';

interface InputModalProps {
	isOpen: boolean;
	label?: string;
	close: () => void;
	onSubmit: (value: string, resetFunction: () => void) => void;
	loading?: boolean;
	defaultValue?: string;
	inputPlaceholder?: string;
	inputType?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
	buttonText?: string;
}

export default function InputModal({
	isOpen,
	defaultValue,
	inputPlaceholder,
	inputType,
	close,
	onSubmit,
	buttonText,
	loading,
	label
}: InputModalProps) {
	const input = useRef<HTMLInputElement>(null);
	const id = useId();

	useEffect(() => {
		if (!input.current) return;
		if (isOpen) {
			input.current.focus();
			input.current.value = defaultValue || '';
		}
	}, [isOpen]);

	function submitHandler(e: FormEvent) {
		e.preventDefault();
		if (input.current?.value) onSubmit(input.current.value, resetInput);
	}

	function resetInput() {
		if (input.current) input.current.value = '';
	}

	return (
		<Modal isOpen={isOpen} close={close}>
			<form onSubmit={submitHandler}>
				<div className="flex flex-col gap-1 mb-2">
					{label && (
						<label className="font-medium text-sm" htmlFor={id}>
							{label}
						</label>
					)}
					<Input
						autoComplete="off"
						ref={input}
						placeholder={inputPlaceholder}
						type={inputType}
						id={id}
						required
					/>
				</div>
				<Button loading={loading} full type="submit">
					{buttonText ?? 'Save'}
				</Button>
			</form>
		</Modal>
	);
}
