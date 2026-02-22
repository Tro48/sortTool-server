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
}
.tab {
  display: flex;
  border-bottom: 1px solid var(--bg-color);
  padding: 5px 30px;
  background: transparent;
  cursor: pointer;
  font: inherit;
}
.tab.active {
  background: var(--active);
  color: #fff;
}
.tab-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  inline-size: 100%;
  block-size: 100%;
  background-color: var(--bg-color-section);
  padding: 5px;
}
.empty {
  color: #777;
}
</style>
