<template>
	<Icomoon :iconSet="iconSet" v-bind="$props" />
</template>

<script setup>
import { Icomoon } from 'vue-icomoon';
import iconSet from '/selection.json';
</script>
