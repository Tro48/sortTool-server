<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import mockLogs from '../mockLogs.json'
import LogItem from './LogItem.vue'

const logsList = ref<HTMLUListElement | null>(null)

async function scrollToBottom() {
  await nextTick()
  if (logsList.value) {
    logsList.value.scrollTop = logsList.value.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
})

watch(
  () => mockLogs.length,
  () => {
    scrollToBottom()
  },
)
</script>
<template>
  <section class="section">
    <h4 class="section-header">
      <span class="log-name">Имя</span>
      <span class="log-state">Состояние</span>
      <span class="log-message">Сообщение</span>
    </h4>
    <ul class="logs-list" ref="logsList">
      <LogItem
        v-for="value in mockLogs"
        :key="value.name"
        :name="value.name"
        :state="value.state"
        :message="value.message"
      />
    </ul>
  </section>
</template>
<style scoped>
.section-header {
  display: flex;
  gap: 5px;
  inline-size: 100%;
  border-bottom: 1px solid var(--bg-color);
  font-size: 24px;
}

.section-header > span:not(:last-child) {
  border-right: 1px solid var(--bg-color);
}

.log-name {
  inline-size: 25%;
}
.log-state {
  inline-size: 10%;
}
.log-message {
  inline-size: 60%;
}

.section {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 5px;
  inline-size: 100%;
  block-size: 100%;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  inline-size: 100%;
  block-size: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
}
</style>
