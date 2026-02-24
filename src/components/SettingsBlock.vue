<script setup lang="ts">
import ButtonUi from './ButtonUi.vue'
import Input from './Input.vue'
import SearchInput from './SearchInput.vue'
import SettingsElementsListUi from './SettingsElementsListUi.vue'
const handleClick = (e: MouseEvent) => {
  console.log(e)
}

const separatorsMock = [
  {
    id: 1,
    value: '_',
  },
  {
    id: 2,
    value: '-',
  },
  {
    id: 3,
    value: '?',
  },
]

const foldersMock = [
  {
    label: 'Folder 1',
    value: 'folder1',
  },
  {
    label: 'Folder 2',
    value: 'folder2',
  },
  {
    label: 'Folder 3',
    value: 'folder3',
  },
]

const tagsMock = [
  {
    label: 'CMYK',
    value: 'CMYK',
  },
  {
    label: 'CMYKV',
    value: 'CMYKV',
  },
  {
    label: 'CMY',
    value: 'CMY',
  },
]

const tagsListMock = [
  {
    id: '1',
    tag: 'CMYK',
    folderDir: 'folder1',
  },
  {
    id: '2',
    tag: 'CMYKV',
    folderDir: 'folder2',
  },
  {
    id: '3',
    tag: 'CMY',
    folderDir: 'folder3',
  },
  {
    id: '4',
    tag: 'CMY',
    folderDir: 'folder3',
  },
  {
    id: '5',
    tag: 'CMY',
    folderDir: 'folder3',
  },
  {
    id: '6',
    tag: 'CMY',
    folderDir: 'folder3',
  },
    {
    id: '1',
    tag: 'CMYK',
    folderDir: 'folder1',
  },
  {
    id: '2',
    tag: 'CMYKV',
    folderDir: 'folder2',
  },
  {
    id: '3',
    tag: 'CMY',
    folderDir: 'folder3',
  },
  {
    id: '4',
    tag: 'CMY',
    folderDir: 'folder3',
  },
  {
    id: '5',
    tag: 'CMY',
    folderDir: 'folder3',
  },
  {
    id: '6',
    tag: 'CMY',
    folderDir: 'folder3',
  },  {
    id: '1',
    tag: 'CMYK',
    folderDir: 'folder1',
  },
  {
    id: '2',
    tag: 'CMYKV',
    folderDir: 'folder2',
  },
  {
    id: '3',
    tag: 'CMY',
    folderDir: 'folder3',
  },
  {
    id: '4',
    tag: 'CMY',
    folderDir: 'folder3',
  },
  {
    id: '5',
    tag: 'CMY',
    folderDir: 'folder3',
  },
  {
    id: '6',
    tag: 'CMY',
    folderDir: 'folder3',
  },
]
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
        <form class="form" action="">
          <div class="input-group">
            <h3 class="input-header">
              Разделитель: <span><SettingsElementsListUi :separators="separatorsMock" /></span>
            </h3>
            <Input type="text" placeholder="_,-,!..." />
          </div>
          <ButtonUi type="submit"><v-icon>mdi-plus-circle-outline</v-icon></ButtonUi>
        </form>
      </div>
      <div class="settings-block">
        <form class="form" action="">
          <div class="input-group">
            <h3 class="input-header">
              Игнорируемые символы:
              <span><SettingsElementsListUi :separators="separatorsMock" /></span>
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
            <SearchInput :options="foldersMock" placeholder="Выберите папку" />
          </div>
          <ButtonUi type="submit"><v-icon>mdi-tag-plus-outline</v-icon></ButtonUi>
        </form>
      </div>
    </div>
    <div class="tag-list-block">
      <div class="tag-list-header-block">
        <h3 class="input-header">Список цветовых схем:</h3>
        <SearchInput :options="tagsMock" placeholder="Поиск по цветовым схемам" />
      </div>
      <ul class="tag-list">
        <li class="tag-list-item" v-for="tagItem in tagsListMock">
          <span>{{ tagItem.tag }}</span>
          <span>{{ tagItem.folderDir }}</span>
          <ButtonUi customClass="delete-button" tooltip="Удалить цветовую схему"
            ><v-icon>mdi-close-circle-outline</v-icon></ButtonUi
          >
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

.tag-list-item:hover{
  background-color: var(--hover-page);
}

</style>
