<template>
	<div class="flex items-center justify-center h-32" v-if="storage.folderLoading">
		<Loading class="w-20 h-20" />
	</div>
	<div class="gap-2 flex flex-col" v-else-if="storage.folders && storage.folders.length > 0">
		<h4 class="font-medium text-xl">Folders</h4>
		<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-2">
			<Folder is-root />
			<Folder v-for="folder in storage.folders" :folder="folder" :key="folder._id" />
		</div>
	</div>
</template>

<script setup>
import { useFileStore } from '@/stores/file';
import Folder from '@/components/dashboard/Folder.vue';
import Loading from '@/components/ui/Loading.vue';
const storage = useFileStore();
</script>
