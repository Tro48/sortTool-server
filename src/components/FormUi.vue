<script setup lang="ts">
const props = defineProps<{
  handler: () => void;
  typeForm: 'separator' | 'ignoredChars' | 'tagsInput';
}>();

const { handler, typeForm } = props;
</script>
<template>
  <form @submit.prevent @submit="handler" :class="['form', {'form-tag': typeForm === 'tagsInput'}]">
    <slot></slot>
  </form>
</template>
<style scoped>
.form {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-end;
	gap: var(--gap-page);
}

.form.form-tag {
	flex-direction: row;
}
</style>
