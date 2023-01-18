import { Link } from 'react-router-dom';
import { Fragment, useState, MouseEvent, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Button from './Button';

export interface Item {
	title: string;
	onClick?: () => void;
	to?: string;
}
interface DropdownProps {
	items: Item[];
	children: JSX.Element | string;
	className?: string;
	buttonVariant?: 'primary' | 'secondary' | 'danger' | 'white';
	buttonSize?: 'small' | 'medium';
}
export default function Dropdown({ items, children, className, buttonVariant, buttonSize }: DropdownProps) {
	const [open, setOpen] = useState(false);
	const [rect, setRect] = useState<DOMRect>();

	useEffect(() => {
		if (!open) return;
		const handleResize = () => setOpen(false);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [open]);

	function clickHandler(e: MouseEvent) {
		const element = e.target as HTMLElement;
		setRect(element.getBoundingClientRect());
		setOpen(prevState => !prevState);
	}

	function itemClickHandler(callback?: () => void) {
		callback?.();
		setOpen(false);
	}

	let left = Number(rect?.left) - Number(rect?.width) / 2;
	if (left < 10) left = 10;

	return (
		<div className={className}>
			<Button variant={buttonVariant} size={buttonSize} onClick={clickHandler}>
				{children}
			</Button>
			<AnimatePresence>
				{open && (
					<>
						<div onClick={() => setOpen(false)} className="fixed z-40 inset-0 bg-gray-900/10" />
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							style={{
								position: 'absolute',
								top: rect?.bottom,
								left
							}}
							className="z-50 mt-2 w-fit overflow-hidden origin-top rounded-md border border-gray-100 bg-white shadow-lg"
							role="menu"
						>
							<div className="flow-root py-2 ">
								<div className="-my-2 divide-y divide-gray-100">
									<div className="p-2">
										{items.map((item, index) => (
											<Fragment key={index}>
												{item?.to ? (
													<Link
														className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
														to={item.to}
													>
														{item.title}
													</Link>
												) : (
													<button
														className="block w-full text-left rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
														role="menuitem"
														onClick={() => itemClickHandler(item?.onClick)}
													>
														{item.title}
													</button>
												)}
											</Fragment>
										))}
									</div>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
