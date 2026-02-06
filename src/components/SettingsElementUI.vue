<script setup lang="ts">
import ButtonUi from './ButtonUi.vue'
defineProps<{
  title: string
  value: string
  buttonChild: string
  onClick?: (event: MouseEvent) => void
}>()
</script>

<template>
  <div class="element-container">
    <div class="info-block">
      <h4>{{ title }}</h4>
      <p>{{ value }}</p>
    </div>
    <ButtonUi class="element-button" @click="onClick">{{ buttonChild }}</ButtonUi>
  </div>
</template>

<style scoped>
.element-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  inline-size: 100%;
  padding: 5px;
  border-radius: 10px;
  background-color: #575757;
}
.info-block {
  display: flex;
  flex-direction: column;
}
.info-block > h4 {
  font-size: 0.7em;
  font-weight: 400;
  color: black;
  padding-left: 5px;
  text-transform: uppercase;
}
.info-block > p {
  font-size: 0.6em;
  font-weight: 400;
  color: var(--text-color);
  padding-left: 5px;
}
.element-button {
  margin: 10px;
}
</style>
