<script setup lang="ts">
const props = defineProps<{
	type: 'separator' | 'ignoredChars' | 'tagsInput' | 'tagsList' | 'default';
}>();

const { type } = props;
</script>
<template>
	<div
		:class="[
			'settings-block',
			{
				'settings-block-tag': type === 'tagsInput',
				'tag-list-block': type === 'tagsList',
				'settings-block-default': type === 'default',
			},
		]"
	>
		<slot></slot>
	</div>
</template>
<style scoped>
.settings-block {
	display: flex;
	flex-direction: column;
	gap: var(--gap-page);
	inline-size: var(--inline-size-full);
	padding: var(--padding-settings-block);
	border: 1px solid var(--bg-color);
	box-shadow: var(--shadow);
	border-radius: var(--br-page);
	background-color: var(--bg-color-section);
}

.settings-block-default {
	padding: calc(var(--padding-page) * 2);
}

.tag-list-block {
	overflow: hidden;
	padding: var(--padding-page);
}

.settings-block.settings-block-tag {
	grid-column: span 2;
}
</style>
