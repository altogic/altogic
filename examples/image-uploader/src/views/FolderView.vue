<template>
	<ListFiles :title="title" />
</template>

<script setup>
import ListFiles from '@/components/dashboard/ListFiles.vue';
import { useFileStore } from '@/stores/file';
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const storage = useFileStore();
const route = useRoute();
const router = useRouter();

const title = computed(() => {
	const folder = storage.folders?.find(folder => folder.slug === route.params.slug);
	return `${folder?.name} Folder`;
});

watch(
	() => storage.folders,
	newFolders => {
		const folder = newFolders?.find(folder => folder.slug === route.params.slug);
		if (!folder) {
			router.push({ name: 'dashboard' });
		}
	}
);
</script>
