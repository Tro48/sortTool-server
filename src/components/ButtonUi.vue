<script setup lang="ts">
const props = defineProps<{ customClass?: string; tooltip?: string }>()
</script>

<template>
  <button v-if="props.tooltip" class="button" :class="props.customClass" v-tooltip="props.tooltip">
    <slot></slot>
  </button>

  <button v-else class="button" :class="props.customClass">
    <slot></slot>
  </button>
</template>

<style scoped>
.button {
  padding: 5px 5px;
  background-color: transparent;
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-color);
  transition: 0.3s;
}

.button:hover {
  opacity: 0.9;
  transition: 0.3s;
}

.button:active {
  scale: 0.98;
}
</style>
