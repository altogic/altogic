import { Modal as ModalFlowBite } from 'flowbite-react';
import { MouseEvent, ReactNode, useEffect } from 'react';

interface ModalProps {
	isOpen: boolean;
	close: () => void;
	children: ReactNode;
}

export default function Modal({ isOpen, close, children }: ModalProps) {
	useEffect(() => {
		if (!isOpen) return;

		function handler(event: KeyboardEvent) {
			if (event.key === 'Escape') close?.();
		}

		document.addEventListener('keydown', handler);

		return () => document.removeEventListener('keydown', handler);
	}, [isOpen]);

	function clickOutSide(event: MouseEvent) {
		if (event.target === event.currentTarget) close?.();
	}

	return (
		<ModalFlowBite
			onClick={clickOutSide}
			className="!h-full [&>:first-child]:h-auto"
			show={isOpen}
			size="md"
			popup={true}
			onClose={close}
		>
			<ModalFlowBite.Header />
			<ModalFlowBite.Body>{children}</ModalFlowBite.Body>
		</ModalFlowBite>
	);
}
