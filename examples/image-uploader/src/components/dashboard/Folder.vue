<template>
	<router-link
		v-if="isRoot"
		exact-active-class="ring ring-2 ring-offset-2 ring-primary"
		:to="{ name: 'dashboard' }"
		class="cursor-pointer p-2 flex items-center justify-center border aspect-square flex-col gap-2"
	>
		<div class="flex-1 w-full h-12 overflow-hidden flex items-center justify-center">
			<FolderIcon class="text-primary" />
		</div>
		<span class="folder-name text-center text-sm font-medium mt-auto">all files</span>
	</router-link>
	<router-link
		v-else
		active-class="ring ring-2 ring-offset-2 ring-primary"
		:to="{ name: 'folder', params: { slug: folder.slug } }"
		class="relative group cursor-pointer p-2 flex items-center justify-center border aspect-square flex-col gap-2"
	>
		<div class="flex-1 w-full h-12 overflow-hidden flex items-center justify-center">
			<FolderIcon class="text-primary" />
		</div>
		<div
			class="absolute top-0.5 right-0.5 flex gap-1 opacity-0 transition group-hover:opacity-100"
		>
			<Button
				@click="deleteFolder"
				variant="primary"
				class="bg-red-400 !border-red-500 aspect-square w-10 h-10 !p-0"
			>
				<Icon name="trash" />
			</Button>
		</div>
		<span
			:title="folder.name"
			class="folder-name text-center text-sm font-medium mt-auto"
			>{{ folder.name }}</span
		>
	</router-link>
</template>

<script setup>
import FolderIcon from '@/components/ui/FolderIcon.vue';
import Icon from '@/components/Icon.vue';
import Button from '@/components/ui/Button.vue';
import { useFileStore } from '@/stores/file';
import { onMounted, ref } from 'vue';
const storage = useFileStore();
const deleting = ref(false);

const props = defineProps({
	folder: {
		type: Object,
	},
	isRoot: {
		type: Boolean,
		default: false,
	},
});

const deleteFolder = () => {
	if (deleting.value) return;
	deleting.value = true;
	storage.deleteFolder(props.folder._id);
	deleting.value = false;
};
</script>

<style scoped>
.folder-name {
	white-space: nowrap;
	max-width: 90%;
	@apply truncate;
}
</style>
