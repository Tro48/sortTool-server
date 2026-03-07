<script setup lang="ts">
const props = defineProps<{
  type: 'separator' | 'ignoredChars' | 'tagsInput' | 'tagsList';
}>();

const { type } = props;

</script>
<template>
  <div :class="['settings-block', { 'settings-block-tag': type === 'tagsInput', 'tag-list-block': type === 'tagsList' }]">
    <slot></slot>
  </div>
</template>
<style scoped>

.settings-block {
	display: flex;
	flex-direction: column;
	gap: 5px;
	inline-size: 100%;
	padding: 10px 10px 30px 10px;
	border: 1px solid var(--bg-color);
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	background-color: var(--bg-color-section);
}

.tag-list-block {
	overflow: hidden;
	padding: 5px;
}

.settings-block.settings-block-tag {
	grid-column: span 2;
}

</style>
