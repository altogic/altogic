<template>
	<Button @click="openModal" class="px-6">Create Folder</Button>
	<Teleport to="body">
		<Modal title="Create Folder" :open="modalStatus" :close="closeModal">
			<form class="flex flex-col gap-2" @submit.prevent="folderHandler">
				<div class="flex flex-col gap-1">
					<label for="folderName">Folder Name</label>
					<input
						ref="input"
						id="folderName"
						autocomplete="off"
						placeholder="Type your folder name"
						class="border-[#D8D6DE] rounded w-full"
						type="text"
						required
						v-model="folderName"
					/>
				</div>
				<Button class="self-end">Create Folder</Button>
			</form>
		</Modal>
	</Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import Modal from '@/components/ui/Modal.vue';
import Button from '@/components/ui/Button.vue';
import { useFileStore } from '@/stores/file';
import { useToast } from 'vue-toastification';

const input = ref(null);
const folderName = ref('');
const creatingFolder = ref(false);
const storage = useFileStore();
const toast = useToast();

const modalStatus = ref(false);
const closeModal = () => {
	modalStatus.value = false;
};
watch(input, () => {
	input.value?.focus();
});

const openModal = () => {
	modalStatus.value = true;
};

const folderHandler = async () => {
	if (storage.folders?.some(folder => folder.name === folderName.value)) {
		toast.error('Folder name already exists, Please try another name');
		return;
	}
	creatingFolder.value = true;
	await storage.createFolder(folderName.value);
	creatingFolder.value = false;
	folderName.value = '';
	closeModal();
};
</script>
