<script setup lang="ts">
import { useSettings } from '@/stores/useSettingsStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import VueSelect from 'vue3-select-component';

const props = defineProps<{
  modelValue: { type: string, default: '' };
	customClass?: string;
}>();

const selected = ref('');

const model = defineModel()

const emit = defineEmits(['update:modelValue', 'input', 'change'])

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', val)
  emit('input', val)
}

const settings = useSettings();
const { folders, getFolders, pendingFolders } = storeToRefs(settings);

onMounted(() => {
	settings.fetchAllFolders();
});


</script>
<template>
	<VueSelect
		v-if="pendingFolders"
		class="search-input"
		v-model="selected"
		:options="getFolders"
    @input="onInput"
	/>
	<VueSelect
		v-else-if="getFolders"
		class="search-input"
		v-model="model"
		:options="getFolders"
    @input="onInput"
	/>
</template>
<style scoped>
.search-input {
	--vs-width: 50%;
	--vs-background-color: var(--bg-color);
	--vs-text-color: var(--text-color);
	--vs-placeholder-color: var(--vs-text-color);
	--vs-outline-color: var(--vs-text-color);
	--vs-option-background-color: var(--bg-color);
	--vs-option-selected-background-color: var(--active);
	--vs-option-hover-background-color: var(--hover-page);
	--vs-border: none;
	--vs-padding: 4px;
	--vs-option-padding: 4px;
	--vs-font-size: 14px;
}
</style>
