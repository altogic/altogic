<template>
	<div class="flex justify-center" v-if="storage.filesInfo?.totalPages > 1">
		<div class="flex flex-col items-center">
			<span class="text-sm text-gray-700 dark:text-gray-400">
				Showing
				<span class="font-semibold text-gray-900">{{
					storage.filesInfo?.currentPage
				}}</span>
				to
				<span class="font-semibold text-gray-900">{{
					storage.filesInfo?.totalPages
				}}</span>
				of
				<span class="font-semibold text-gray-900">{{
					storage.filesInfo?.count
				}}</span>
				Entries
			</span>
			<div class="inline-flex mt-2 xs:mt-0">
				<button
					:disabled="page === 1"
					@click="prev"
					class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-l enabled:hover:bg-gray-900 disabled:opacity-80 disabled:cursor-not-allowed"
				>
					<svg
						aria-hidden="true"
						class="w-5 h-5 mr-2"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
							clip-rule="evenodd"
						/>
					</svg>
					Prev
				</button>
				<button
					:disabled="page === storage.filesInfo?.totalPages"
					@click="next"
					class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary border-0 border-l border-gray-700 rounded-r enabled:hover:bg-gray-900 disabled:opacity-80 disabled:cursor-not-allowed"
				>
					Next
					<svg
						aria-hidden="true"
						class="w-5 h-5 ml-2"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useFileStore } from '@/stores/file';
const storage = useFileStore();
defineProps({
	page: {
		type: Number,
		required: true,
	},
	next: {
		type: Function,
		required: true,
	},
	prev: {
		type: Function,
		required: true,
	},
});
</script>
