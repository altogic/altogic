<template>
	<div v-if="open" class="modal z-50 fixed inset-0 flex items-center justify-center">
		<div
			class="overflow-hidden relative modal-body bg-white rounded-[20px] min-h-[200px] max-h-[95%]"
		>
			<Button
				class="!absolute w-8 h-8 !p-0 right-2 aspect-square !top-2 !rounded-full"
				@click="close()"
			>
				<Icon name="close" :size="10" />
			</Button>
			<header class="p-4 font-medium text-[20px] flex items-center" v-if="title">
				{{ title }}
			</header>
			<div class="p-6 max-h-[700px] overflow-auto">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup>
import Icon from '@/components/Icon.vue';
import Button from '@/components/ui/Button.vue';

defineProps({
	title: {
		type: String,
	},
	open: {
		type: Boolean,
		required: true,
		default: false,
	},
	close: {
		type: Function,
		required: true,
	},
});
</script>

<style scoped>
.modal {
	background: rgba(33, 12, 255, 0.15);
}
.modal-body {
	width: min(100% - 2rem, 600px);
}
</style>
