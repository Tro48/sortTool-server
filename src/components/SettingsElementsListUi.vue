<script setup lang="ts">
const props = defineProps<{
  separators: { id: number; value: string }[]
}>()
</script>
<template>
  <ul class="separator-list">
    <li v-for="separator in props.separators" class="separator-item" :key="separator.id">
      {{ separator.value }}
    </li>
  </ul>
</template>
<style scoped>
.separator-list {
  display: flex;
  gap: 5px;
}

.separator-item {
  font-size: 14px;
  padding: 5px 10px;
  background-color: var(--bg-color);
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.separator-item:hover {
  background-color: var(--hover-page);
  transition: background-color 0.3s ease;
}

</style>
