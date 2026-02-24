<script setup lang="ts">
import { ref } from 'vue'
import type { Option } from 'vue3-select-component'
import VueSelect from 'vue3-select-component'

const props = withDefaults(
  defineProps<{
    customClass?: string
    options?: Option<string>[]
  }>(),
  {
    customClass: '',
    options: () => [],
  },
)

const { options } = props

const selected = ref('')
</script>
<template>
  <VueSelect
    class="search-input"
    v-model="selected"
    :options="options"
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
