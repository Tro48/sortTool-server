<script setup lang="ts">
import LogsBlock from './components/LogsBlock.vue'
import SettingsBlock from './components/SettingsBlock.vue'
import TabsPanel from './components/TabsPanel.vue'
</script>

<template>
  <header class="header">
    <h1>SortTool Settings</h1>
  </header>
  <main class="main">
    <TabsPanel :names="['Логи', 'Настройки']" :panels="[LogsBlock, SettingsBlock]" />
  </main>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  inline-size: 100%;
  background-color: transparent;
  border-radius: 5px;
  color: var(--text-color);
  padding: 5px;
}
.header > h1 {
  font-size: 1.5rem;
  font-weight: 400;
}
.main {
  inline-size: 100%;
  min-block-size: 85vh;
  max-block-size: 90vh;
  padding: 0 5px;
  color: var(--text-color);
}
</style>
