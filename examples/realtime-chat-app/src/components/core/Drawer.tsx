import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../index';
import { ReactNode, useEffect } from 'react';
import { CloseIcon, LeftArrow } from '../icon';

interface DrawerProps {
	isOpen: boolean;
	close: () => void;
	children: ReactNode;
	title?: string;
	from: 'left' | 'right';
	className?: string;
}
export default function Drawer({ isOpen, close, children, title, className, from = 'left' }: DrawerProps) {
	useEffect(() => {
		const keyDownHandler = (e: KeyboardEvent) => {
			if (e.code === 'Escape') close();
		};
		document.addEventListener('keydown', keyDownHandler);
		return () => document.removeEventListener('keydown', keyDownHandler);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const directions = {
		left: {
			initial: { left: '-100%' },
			animate: { left: 0 },
			exit: { left: '-100%' },
		},
		right: {
			initial: { right: '-100%' },
			animate: { right: 0 },
			exit: { right: '-100%' },
		},
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.section
					initial={directions[from].initial}
					animate={directions[from].animate}
					transition={{ type: 'tween' }}
					exit={directions[from].exit}
					className={`absolute top-0 bottom-0 z-[99999999] grid w-full grid-rows-[auto_1fr] bg-drawer-background-light shadow dark:bg-drawer-background-dark ${
						className ?? ''
					}`}
				>
					<header
						className={`flex items-end  p-2 text-drawer-header-title-light dark:text-drawer-header-title-dark ${
							from === 'right'
								? 'h-h-pane-header justify-between bg-panel-header-background-light p-4 dark:bg-panel-header-background-dark'
								: 'h-[111px] bg-panel-background-colored-light dark:bg-panel-background-colored-dark'
						}`}
					>
						<div
							className={`flex items-center gap-4 ${
								from === 'right' ? 'w-full text-primary-strong-light dark:text-primary-strong-dark' : ''
							}`}
						>
							<Button onClick={close} className="text-inherit" withIcon>
								{from === 'left' ? <LeftArrow /> : <CloseIcon />}
							</Button>
							{title && <span className="text-[19px]">{title}</span>}
						</div>
					</header>
					{children}
				</motion.section>
			)}
		</AnimatePresence>
	);
}
