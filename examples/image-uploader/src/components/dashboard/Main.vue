<template>
	<div class="p-8 flex flex-col gap-4 overflow-auto">
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-2 md:flex-row justify-between md:items-center">
				<h1 class="font-medium text-3xl lg:text-[30px] xl:text-[38px]">My Drive</h1>
				<div class="flex gap-2">
					<CreateFolder />
					<UploadFile />
				</div>
			</div>
			<!--
			<form class="flex items-center justify-center w-full">
				<input
					placeholder="Search File, Folder, Drive name"
					class="!border-[#D9D9D9] !ring-0 h-[40px] flex-1 !outline-none placeholder-gray-400"
					type="text"
				/>
				<button class="border text-gray-400 border-[#D9D9D9] border-l-0 w-[40px] h-[40px] shrink-0">
					<Icon name="search" />
				</button>
			</form>
			-->
		</div>
		<ListFolders />
		<router-view />
	</div>
</template>

<script setup>
import Button from '@/components/ui/Button.vue';
import ListFolders from '@/components/dashboard/ListFolders.vue';
import { useFileStore } from '@/stores/file';
import CreateFolder from '@/components/dashboard/CreateFolder.vue';
import UploadFile from '@/components/dashboard/UploadFile.vue';

const storage = useFileStore();
</script>
