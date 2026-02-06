<script setup lang="ts">
import ControlsBlock from './components/ControlsBlock.vue';
import LogsBlock from './components/LogsBlock.vue';
import SettingsBlock from './components/SettingsBlock.vue';
</script>

<template>
  <header class="header">
    <h1>SortTool Settings</h1>
  </header>
  <main class="main">
    <ControlsBlock></ControlsBlock>
    <SettingsBlock></SettingsBlock>
    <LogsBlock></LogsBlock>
  </main>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  inline-size: 100%;
  background-color: black;
  border-radius: 5px;
  color: var(--text-color);
  padding: 5px;
}
.header > h1 {
  font-size: 1.5rem;
  font-weight: 400;
}
.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  inline-size: 100%;
  min-block-size: 96vh;
  max-block-size: 96vh;
  padding: 0 5px;
  color: var(--text-color);
}
.section {
  inline-size: 100%;
  max-inline-size: 100vw;
}
section > h3 {
  padding: 5px;
  background-color: rgb(48, 48, 48);
  font-size: 1rem;
  font-weight: 400;
  text-transform: uppercase;
}
</style>
