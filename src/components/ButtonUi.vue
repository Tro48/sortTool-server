<script setup lang="ts">
const props = defineProps<{ customClass?: string; tooltip?: string; disabled?: boolean }>();
</script>

<template>
	<button
		:disabled="props.disabled"
		v-if="props.tooltip"
		class="button"
		:class="props.customClass"
		v-tooltip="props.tooltip"
	>
		<slot></slot>
	</button>

	<button :disabled="props.disabled" v-else class="button" :class="props.customClass">
		<slot></slot>
	</button>
</template>

<style scoped>
.button {
	background-color: transparent;
	border-radius: 10px;
	cursor: pointer;
	color: var(--text-color);
	transition: 0.3s;
}

.button:hover {
	opacity: 0.9;
	color: var(--active);
	transition: 0.3s;
}

.button:active {
	scale: 0.9;
}

.button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.button:disabled:hover {
	color: var(--text-color);
}
</style>
