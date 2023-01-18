import { motion, AnimatePresence } from 'framer-motion';
import { APIError } from 'altogic';

export default function ShowApiError({ errors }: { errors: APIError | null }) {
	return (
		<AnimatePresence>
			{errors && errors.items?.length > 0 && (
				<motion.div
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0 }}
					className="bg-red-500 text-sm p-4 text-white rounded m-0.5 mb-2 min-h-12 gap-2 flex flex-col rounded-[0.5rem]"
				>
					{errors.items.map((error, index) => (
						<span className="text-sm md:text-[15px]" key={index}>
							{error.message}
						</span>
					))}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
