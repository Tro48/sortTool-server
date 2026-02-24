<script setup lang="ts">
import type { Component } from 'vue'
import { ref } from 'vue'

const props = defineProps<{
  names: string[]
  panels: Array<Component | Record<string, unknown> | string>
}>()

const active = ref(0)

function select(index: number) {
  if (index < 0 || index >= (props.names?.length ?? 0)) return
  active.value = index
}
</script>

<template>
  <div class="tabs">
    <div class="tab-list" role="tablist">
      <button
        v-for="(name, i) in props.names"
        :key="i"
        role="tab"
        :aria-selected="active === i"
        :class="{ tab: true, active: active === i }"
        @click="select(i)"
      >
        {{ name }}
      </button>
    </div>

    <div class="tab-panel" role="tabpanel">
      <component v-if="props.panels && props.panels[active]" :is="props.panels[active]" />
      <div v-else class="empty">Нет панели для этого таба</div>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 8px;
  inline-size: 100%;
  block-size: 92vh;
}
.tab-list {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color-section);
  gap: 5px;
  border-radius: 5px;
  inline-size: 20%;
  padding: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.tab {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 30px;
  background-color: transparent;
  border: 1px solid var(--bg-color);
  border-radius: 5px;
  cursor: pointer;
  font: inherit;
  transition: background-color .3s;
}
.tab.active {
  background-color: var(--active);
  color: #fff;
  cursor:default;
}

.tab.active:hover {
  background-color: var(--active);
  transition: background-color .3s;
}

.tab:hover {
  background-color: var(--hover-menu-button);
  transition: background-color .3s;
}
.tab-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  inline-size: 100%;
  block-size: 100%;
  border-radius: 5px;
}
.empty {
  color: #777;
}
</style>
