import { motion, AnimatePresence } from 'framer-motion';

export default function ShowApiError({ error }) {
	return (
		<AnimatePresence>
			{error && (
				<motion.div
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0 }}
					className="bg-red-500 text-sm p-4 text-white rounded m-0.5 mb-2 min-h-12 flex flex-col rounded-[0.5rem]"
				>
					{error.map((item, index) => (
						<span className="text-[15px]" key={index}>
							{item.message}
						</span>
					))}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
