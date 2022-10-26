import { ReactNode, useEffect, useRef, useState, MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Dropdown({
	data,
	className,
	children,
	locationX = 'center',
	locationY = 'bottom',
	onlyIcon,
}: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdown = useRef(null);
	const positionX = {
		left: 'left-0',
		right: 'right-0',
		center: 'left-1/2 -translate-x-1/2',
	};

	const onClickHandler = (e: MouseEvent) => {
		setIsOpen(state => !state);
	};

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen]);

	return (
		<>
			{isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-[9999999997] bg-transparent" />}
			<div className={`!relative ${className ?? ''}`}>
				<button
					className={onlyIcon ? 'flex h-10 w-10 items-center justify-center rounded-full outline-none' : ''}
					onClick={onClickHandler}
				>
					<span>{children}</span>
				</button>
				<AnimatePresence>
					{isOpen && (
						<motion.div
							ref={dropdown}
							initial={{
								opacity: 0,
								...(locationY === 'bottom' && { top: '90%', y: 0 }),
								...(locationY === 'top' && { bottom: '10%' }),
								height: 0,
							}}
							animate={{
								opacity: 1,
								...(locationY === 'bottom' && { top: '100%', y: '2px' }),
								...(locationY === 'top' && { bottom: '100%' }),
								height: 'fit-content',
							}}
							exit={{
								opacity: 0,
								...(locationY === 'bottom' && { top: '90%', y: 0 }),
								...(locationY === 'top' && { bottom: '10%' }),
								height: 0,
							}}
							transition={{
								type: 'tween',
							}}
							className={`dropdown absolute z-[9999999999] min-w-[150px] overflow-hidden rounded bg-dropdown-background-light dark:bg-dropdown-background-dark ${positionX[locationX]}`}
						>
							{data.length > 0 && (
								<ul className="flex flex-col gap-[2px] py-[5px]">
									{data.map(({ title, onClick, icon }, index) => (
										<li
											className="flex cursor-pointer items-center gap-2 px-[24px] py-[12px] transition hover:bg-background-default-hover-light dark:hover:bg-background-default-hover-dark"
											onClick={onClick}
											key={index}
										>
											{icon && (
												<span className="flex min-w-[30px] max-w-[30px] items-center justify-center">
													{icon}
												</span>
											)}
											<span className="flex-1 whitespace-nowrap text-left text-[14.5px] text-primary-light dark:text-primary-dark">
												{title}
											</span>
										</li>
									))}
								</ul>
							)}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
}

interface DropdownProps {
	className?: string;
	children?: ReactNode;
	locationX?: 'left' | 'right' | 'center';
	locationY?: 'top' | 'bottom';
	onlyIcon?: boolean;
	data: {
		title: string;
		onClick: () => void;
		icon?: JSX.Element;
	}[];
}
