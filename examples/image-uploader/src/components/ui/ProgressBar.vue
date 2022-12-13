<template>
	<div
		class="relative overflow-hidden border border-gray-400 rounded-full w-full text-center text-sm h-[25px] flex items-center justify-center"
	>
		<span class="percent font-medium">{{ percent }}%</span>
		<span class="loader bg-emerald-400" :style="{ width: `${percent}%` }" />
	</div>
</template>

<script setup>
defineProps({
	percent: {
		type: Number,
		default: 0,
	},
});
</script>

<style scoped>
.loader {
	z-index: 1;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: 100px;
}
.percent {
	z-index: 2;
}
</style>
