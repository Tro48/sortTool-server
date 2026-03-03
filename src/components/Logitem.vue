<script setup lang="ts">
const props = defineProps<{
	name: string;
	state: 'pending' | 'pass' | 'error';
	message: string;
}>();
</script>
<template>
	<li class="log-item">
		<p class="log-name">{{ props.name }}</p>
		<div v-if="props.state === 'pending'" class="log-state">
			<v-progress-circular color="var(--active)" size="20" indeterminate></v-progress-circular>
		</div>
		<div v-else-if="props.state === 'pass'" class="log-state">
			<v-icon style="color: green">mdi-check-circle-outline</v-icon>
		</div>
		<div v-else-if="props.state === 'error'" class="log-state">
			<v-icon style="color: red">mdi-alert-circle-outline</v-icon>
		</div>
		<p class="log-message">{{ props.message }}</p>
	</li>
</template>
<style scoped>
.log-item {
	display: grid;
	grid-template-columns: 25% 15% 60%;
	gap: 5px;
	padding: 5px;
	inline-size: 100%;
	background-color: transparent;
	transition: background-color 0.3s;
	border: 1px solid var(--bg-color);
	border-radius: 5px;
}

.log-item:nth-child(2n) {
	background-color: var(--bg-color);
	transition: background-color 0.3s;
}

.log-item:hover,
.log-item:nth-child(2n):hover {
	background-color: var(--hover-page);
	transition: background-color 0.3s;
}
.log-name {
	border-right: 1px solid var(--bg-color);
}

.log-message {
	padding-left: 5px;
	border-left: 1px solid var(--bg-color);
}

.log-state {
	justify-self: center;
}

.log-item:nth-child(2n) > .log-name,
.log-item:nth-child(2n) > .log-message {
	border-color: var(--bg-color-section);
}
</style>
