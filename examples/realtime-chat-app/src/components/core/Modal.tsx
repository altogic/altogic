import { useEffect, useRef, ReactNode, MouseEvent } from 'react';
import { BsX } from 'react-icons/bs';
import { Button } from '../';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon } from '../icon';

interface ModalProps {
	children: ReactNode;
	className?: string;
	isOpen: boolean;
	title?: string;
	closeModal: () => void;
	closeOnOverlayClick?: boolean;
}
export default function Modal({
	children,
	className,
	isOpen = false,
	title,
	closeModal = () => {},
	closeOnOverlayClick = false,
}: ModalProps) {
	const modalOverlay = useRef(null);

	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === 'Escape') closeModal();
		};
		window.addEventListener('keydown', handleEsc);
		return () => window.removeEventListener('keydown', handleEsc);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const clickOutside = (event: MouseEvent) => {
		if (!closeOnOverlayClick) return;
		if (modalOverlay?.current === event.target) closeModal();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div
					ref={modalOverlay}
					className="modal open fixed inset-0 z-[99999999999999999] flex items-center justify-center bg-modal-backdrop-light p-4 dark:bg-modal-backdrop-dark"
					onClick={clickOutside}
				>
					<motion.div
						initial={{ scale: '0', opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						transition={{ type: 'tween' }}
						className={`modal-shadow relative max-h-[500px] w-[436px] rounded ${className ?? ''}`}
					>
						<header className="flex h-h-pane-header items-center gap-[10px] rounded-tl-[3px] rounded-tr-[3px] bg-panel-background-colored-deeper-light p-[0_210px_0_10px] dark:bg-panel-background-colored-deeper-dark">
							<Button withIcon onClick={closeModal}>
								<CloseIcon className="text-drawer-header-title-light dark:text-drawer-header-title-dark" />
							</Button>
							{title && (
								<div className="text-[19px] text-drawer-header-title-light dark:text-drawer-header-title-dark">
									{title}
								</div>
							)}
						</header>
						<div>{children}</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
