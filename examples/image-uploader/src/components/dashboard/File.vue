<template>
	<div
		@click="openPreview"
		class="group cursor-pointer relative p-2 flex items-center justify-center border aspect-square flex-col gap-2"
	>
		<div class="flex-1 w-full h-12 overflow-hidden flex items-center justify-center">
			<img
				draggable="false"
				class="object-contain"
				:src="file.publicPath"
				:alt="file.fileName"
			/>
		</div>
		<div
			class="absolute top-0.5 right-0.5 flex gap-1 opacity-0 transition group-hover:opacity-100"
		>
			<Button
				@click.stop="copyURL"
				variant="primary"
				class="aspect-square w-10 h-10 !p-0"
			>
				<Icon name="copy" />
			</Button>
			<Button
				@click.stop="deleteFile"
				variant="primary"
				class="bg-red-400 !border-red-500 aspect-square w-10 h-10 !p-0"
			>
				<Loading v-if="deleting" />
				<Icon name="trash" v-else />
			</Button>
		</div>
		<span class="file-name text-center text-sm font-medium mt-auto">{{
			file.fileName
		}}</span>
	</div>
	<teleport to="body" v-if="isOpenPreview">
		<div
			@click="clickOutside"
			class="fixed inset-0 flex items-center justify-center bg-white/70 z-50"
		>
			<div class="absolute right-1 top-1">
				<Button @click="closePreview" class="!p-0 w-10 h-10">
					<Icon name="close" />
				</Button>
			</div>
			<div
				ref="previewArea"
				class="w-auto max-w-[80%] max-h-[90%] overflow-hidden flex justify-center"
			>
				<img
					draggable="false"
					class="object-contain"
					:src="file.publicPath"
					:alt="file.fileName"
				/>
			</div>
		</div>
	</teleport>
</template>

<script setup>
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/Icon.vue';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useFileStore } from '@/stores/file';
import { useRoute } from 'vue-router';
import Loading from '@/components/ui/Loading.vue';
import router from '@/router';
const deleting = ref(false);
const toast = useToast();
const storage = useFileStore();
const isOpenPreview = ref(false);
const previewArea = ref(null);

const props = defineProps({
	file: {
		type: Object,
		required: true,
	},
});

const route = useRoute();
const page = ref(route.query?.page ? parseInt(route.query.page) : 1);

const clickOutside = e => {
	if (previewArea.value?.contains(e.target)) return;
	closePreview();
};

const openPreview = () => {
	isOpenPreview.value = true;
};

const closePreview = () => {
	isOpenPreview.value = false;
};

const copyURL = async () => {
	await navigator.clipboard.writeText(props.file.publicPath);
	toast.success('URL copied to clipboard');
};

const deleteFile = async () => {
	deleting.value = true;
	const data = await storage.deleteFile({
		url: props.file.publicPath,
		page: page.value,
		tag: route.params.slug ?? null,
	});
	deleting.value = false;
	if (data.length === 0) {
		location.replace('/dashboard');
	}
};
</script>

<style scoped>
.file-name {
	white-space: nowrap;
	max-width: 90%;
	@apply truncate;
}
</style>
