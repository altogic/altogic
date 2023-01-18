import { ComponentPropsWithoutRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '../../helpers';

export interface Props extends ComponentPropsWithoutRef<'input'> {
	showError?: boolean;
	errorMessage?: string;
	onSelected?: (files: File[]) => void;
	label?: string;
	className?: string;
	accept?: string;
	multiple?: boolean;
}

export default function DropZone({
	className,
	label,
	onSelected,
	multiple,
	showError = false,
	errorMessage,
	accept,
	...props
}: Props) {
	function onDrop(acceptedFiles: File[]) {
		onSelected?.(acceptedFiles);
	}

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		multiple: multiple,
		...(accept && { accept: { [accept]: [] } })
	});

	return (
		<label className={className} {...getRootProps()}>
			<div
				className={cn(
					'group-hover:bg-gray-100 cursor-pointer flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md',
					isDragActive ? 'bg-gray-100' : '',
					showError ? 'border-red-600' : ''
				)}
			>
				<div className="space-y-1 text-center">
					<svg
						className="mx-auto h-12 w-12 text-gray-400"
						stroke="currentColor"
						fill="none"
						viewBox="0 0 48 48"
						aria-hidden="true"
					>
						<path
							d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<div className="flex text-sm text-gray-600">
						<span>Click to upload a file</span>
						<input type="file" className="sr-only" {...props} {...getInputProps()} />
						<p className="pl-1">or drag and drop</p>
					</div>
					<p className="text-xs text-gray-500">PNG, JPG, GIF or etc...</p>
				</div>
			</div>
			{showError ? <small className="text-red-600">{errorMessage}</small> : undefined}
		</label>
	);
}
