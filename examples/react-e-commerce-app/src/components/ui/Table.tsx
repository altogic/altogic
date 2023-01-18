import { cn } from '../../helpers';

interface Col {
	colName: string;
	className?: string;
}
interface TableProps {
	cols: Col[] | string[];
	rows: object[];
}
export default function Table({ rows, cols }: TableProps) {
	return (
		<div className="overflow-hidden overflow-x-auto rounded-lg border border-gray-200">
			<table className="min-w-full divide-y divide-gray-200 text-sm">
				<thead className="bg-gray-100">
					<tr>
						{cols.map((col, index) => (
							<th
								key={index}
								className={cn(
									'whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900',
									col instanceof Object ? col.className : ''
								)}
							>
								{col instanceof Object ? col.colName : col}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200">
					{rows.map((row, index) => (
						<tr key={index}>
							{Object.values(row).map((value, index) => (
								<td
									key={index}
									className={cn(
										'px-4 py-2 font-medium text-gray-900',
										index === 0 ? 'w-fit' : 'whitespace-nowrap'
									)}
								>
									{value}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
