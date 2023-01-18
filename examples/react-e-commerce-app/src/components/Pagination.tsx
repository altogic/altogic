import Button from './ui/Button';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { PaginateData } from '../types/altogic';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/all';

interface PaginationProps {
	onPageChange?: () => void;
	paginateData?: PaginateData;
}
export default function Pagination({ onPageChange, paginateData }: PaginationProps) {
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		onPageChange?.();
	}, [searchParams]);

	const nextPage = useMemo(() => {
		return generatePageNumber(1);
	}, [searchParams, paginateData]);

	const prevPage = useMemo(() => {
		return generatePageNumber(-1);
	}, [searchParams, paginateData]);

	const setPage = (page: number) => {
		searchParams.set('page', page.toString());
		setSearchParams(searchParams);
	};

	function generatePageNumber(amount: -1 | 1) {
		const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
		return page + amount;
	}

	if (paginateData?.totalPages! <= 1) return null;

	return (
		<section className="flex justify-center gap-1">
			<Button
				size="small"
				variant="white"
				onClick={() => setPage(prevPage)}
				disabled={Boolean(paginateData?.currentPage && paginateData.currentPage === 1)}
				className="disabled:!border-gray-100 !border-gray-100 shadow-none !rounded"
			>
				<MdKeyboardArrowLeft size={15} />
			</Button>
			<div className="h-8 w-12 flex items-center justify-center text-center tabular-nums rounded border border-gray-100 p-0 text-center text-xs font-medium">
				{searchParams.get('page') ?? 1}
			</div>
			<Button
				size="small"
				variant="white"
				onClick={() => setPage(nextPage)}
				disabled={Boolean(paginateData?.totalPages && paginateData.totalPages < nextPage)}
				className="disabled:!border-gray-100 !border-gray-100 shadow-none !rounded"
			>
				<MdKeyboardArrowRight size={15} />
			</Button>
		</section>
	);
}
