<script setup lang="ts">
import {
  useIgnoredCharsStore,
  useSeparatorsStore,
  useTagsDirStore,
} from '@/stores/useSettingsStore'
import { computed, onMounted, ref } from 'vue'
import ButtonUi from './ButtonUi.vue'
import Input from './Input.vue'
import InputFolders from './InputFolders.vue'
import SettingsElementsListUi from './SettingsElementsListUi.vue'
import Skeleton from './Skeleton.vue'

const ignoredCharsStore = useIgnoredCharsStore()
const separatorsStore = useSeparatorsStore()
const tagsDirStore = useTagsDirStore()

const search = ref('')

const tagsEntries = computed(() => {
  const entries = tagsDirStore.getTagsDir ?? []
  const q = String(search.value || '').trim().toLowerCase()
  if (!q) return entries
  return entries.filter(([k, v]) => {
    const key = String(k ?? '').toLowerCase()
    const val = String(v ?? '').toLowerCase()
    return key.includes(q) || val.includes(q)
  })
})

const separatorData = ref('')

const hendlerFormSeparator = () => {
  separatorsStore.fetchSetSeparator(separatorData.value)
  separatorData.value = ''
}

onMounted(() => {
  ignoredCharsStore.fetchIgnoredChars()
  separatorsStore.fetchSeparators()
  tagsDirStore.fetchAllTagsDir()
})
</script>
<template>
  <section class="settings-section">
    <div class="settings-dw-block">
      <ButtonUi customClass="download-button" tooltip="Загрузить настройки"
        ><v-icon>mdi-file-download-outline</v-icon></ButtonUi
      >
      <ButtonUi customClass="upload-button" tooltip="Сохранить настройки"
        ><v-icon>mdi-file-upload-outline</v-icon></ButtonUi
      >
    </div>
    <div class="settings-blocks-container">
      <div class="settings-block">
        <form @submit.prevent @submit="hendlerFormSeparator" class="form">
          <div class="input-group">
            <h3 class="input-header">
              Разделитель:
              <span
                ><SettingsElementsListUi
                  :loader="separatorsStore.loader"
                  :data="separatorsStore.separators"
              /></span>
            </h3>
            <Input v-model="separatorData" type="text" placeholder="_,-,!..." />
          </div>
          <ButtonUi type="submit"><v-icon>mdi-plus-circle-outline</v-icon></ButtonUi>
        </form>
      </div>
      <div class="settings-block">
        <form class="form" action="">
          <div class="input-group">
            <h3 class="input-header">
              Игнорируемые символы:
              <span
                ><SettingsElementsListUi
                  :loader="ignoredCharsStore.loader"
                  :data="ignoredCharsStore.ignoredChars"
              /></span>
            </h3>
            <Input type="text" placeholder="&, P, +, %..." />
          </div>
          <ButtonUi type="submit"><v-icon>mdi-plus-circle-outline</v-icon></ButtonUi>
        </form>
      </div>
      <div class="settings-block settings-block-tag">
        <form class="form" action="">
          <div class="input-group">
            <label class="input-header" for="tag-name">Цветовая схема:</label>
            <Input id="tag-name" type="text" placeholder="CMYK, BL2..." />
          </div>
          <div class="input-group">
            <label class="input-header" for="tag-folder">Выбрать папку:</label>
            <InputFolders placeholder="Выберите папку" />
          </div>
          <ButtonUi type="submit"><v-icon>mdi-tag-plus-outline</v-icon></ButtonUi>
        </form>
      </div>
    </div>
    <div class="tag-list-block">
      <div class="tag-list-header-block">
        <h3 class="input-header">Список цветовых схем:</h3>
        <Input type="search" placeholder="Поиск" v-model="search" />
      </div>
      <Skeleton v-if="tagsDirStore.loader" width="100%" height="100%" />
      <ul v-else-if="tagsDirStore.getTagsDir" class="tag-list">
        <li class="tag-list-item" v-for="[key, value] in tagsEntries" :key="key">
          <span>{{ key }}</span>
          <span>{{ value }}</span>
          <ButtonUi customClass="delete-button" tooltip="Удалить цветовую схему">
            <v-icon>mdi-close-circle-outline</v-icon>
          </ButtonUi>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.settings-section {
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 5px;
  inline-size: 100%;
  block-size: 100%;
}

.settings-dw-block {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 5px;
  inline-size: 100%;
  background-color: var(--bg-color-section);
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.settings-blocks-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}

.download-button,
.upload-button {
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  inline-size: 100%;
  gap: 5px;
}

.form {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 5px;
}

.input-header {
  display: flex;
  align-items: center;
  gap: 5px;
  inline-size: 100%;
  font-size: 16px;
  font-weight: 600;
}

.settings-block {
  display: flex;
  flex-direction: column;
  gap: 5px;
  inline-size: 100%;
  padding: 10px;
  border: 1px solid var(--bg-color);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  background-color: var(--bg-color-section);
}

.settings-block-tag {
  grid-column: span 2;
}

.tag-list-block {
  display: flex;
  flex-direction: column;
  block-size: 100%;
  overflow: hidden;
  gap: 5px;
  padding: 5px;
  background-color: var(--bg-color-section);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.tag-list-header-block {
  display: flex;
  align-items: center;
  padding: 5px;
  gap: 5px;
  border-bottom: 1px solid var(--bg-color);
}

.tag-list {
  display: flex;
  flex-direction: column;
  padding: 5px;
  gap: 5px;
  inline-size: 100%;
  block-size: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  border: 1px solid var(--bg-color);
  border-radius: 5px;
  scrollbar-width: thin;
}

.tag-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  inline-size: 100%;
  padding: 5px;
  border: 1px solid var(--bg-color);
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.tag-list-item > span {
  inline-size: 100%;
}

.tag-list-item:nth-child(2n) {
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
}

.tag-list-item:hover {
  background-color: var(--hover-page);
}
</style>
