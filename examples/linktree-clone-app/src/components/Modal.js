import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useEffect } from 'react';

export default function Modal({ isOpen, close, children, className, title, ...props }) {
	useEffect(() => {
		const handleEsc = e => {
			if (e.key === 'Escape') close?.();
		};
		document.addEventListener('keydown', handleEsc);
		return () => document.removeEventListener('keydown', handleEsc);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOutsideClick = e => {
		if (e.currentTarget === e.target) close();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div
					onClick={handleOutsideClick}
					className={`modal fixed inset-0 p-4 z-50 bg-white/20 grid place-items-center rounded ${
						className ?? ''
					}`}
					{...props}
				>
					<motion.div
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{
							opacity: 0,
							scale: 0,
						}}
						transition={{ type: 'tween' }}
						className="bg-[#f3f3f1] w-full sm:w-[400px] rounded-xl relative text-black"
					>
						<div className="flex items-center justify-between p-5 pr-2 py-2">
							<span className="text-lg font-medium">{title}</span>
							<button onClick={close} className="w-6 h-6 grid place-items-center">
								<FiX size={20} />
							</button>
						</div>
						<div className="p-2">{children}</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
