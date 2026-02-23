<script setup lang="ts">

const props = defineProps<{
  name: string
  state: string | boolean
  message: string
}>()
</script>
<template>
  <li class="log-item">
    <p class="log-name">{{ props.name }}</p>
    <div class="log-state">{{ props.state }}</div>
    <p class="log-message">{{ props.message }}</p>
  </li>
</template>
<style scoped>
.log-item {
  display: flex;
  gap: 5px;
  padding: 5px;
  inline-size: 100%;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

.log-item:nth-child(2n) {
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
}

.log-item:hover,
.log-item:nth-child(2n):hover {
  background-color: var(--hover-page);
  transition: background-color 0.3s ease;
}
.log-name {
  inline-size: 25%;
}
.log-state {
  inline-size: 15%;
}
.log-message {
  inline-size: 60%;
}
</style>
