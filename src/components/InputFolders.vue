<script setup lang="ts">
import { useFoldersStore } from '@/stores/useSettingsStore'
import { onMounted, ref } from 'vue'
import VueSelect from 'vue3-select-component'
import Skeleton from './Skeleton.vue'

const props = defineProps<{
  customClass?: string
}>()

const foldersStore = useFoldersStore()

onMounted(() => {
  foldersStore.fetchAllFolders()
})

const selected = ref('')
</script>
<template>
    <VueSelect
      v-if="foldersStore.loader"
      class="search-input"
      v-model="selected"
      :options="foldersStore.folders"
    />
    <VueSelect
      v-else-if="foldersStore.getFolders"
      class="search-input"
      v-model="selected"
      :options="foldersStore.getFolders"
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
