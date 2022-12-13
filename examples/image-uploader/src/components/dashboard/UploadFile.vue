<template>
	<Button @click="openModal" variant="primary" class="px-6">Upload File</Button>
	<Teleport to="body">
		<Modal title="Upload Folder" :open="modalStatus" :close="closeModal">
			<Uploader />
		</Modal>
	</Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import Modal from '@/components/ui/Modal.vue';
import Button from '@/components/ui/Button.vue';
import { useFileStore } from '@/stores/file';
import Uploader from '@/components/Uploader.vue';

const input = ref(null);
const storage = useFileStore();

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
</script>
