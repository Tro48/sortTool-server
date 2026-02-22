<script setup lang="ts">
import AddTegBlock from './AddTegBlock.vue'
import SectionHeader from './SectionHeader.vue'
import SettingsElementUI from './SettingsElementUI.vue'
const handleClick = (e: MouseEvent) => {
  console.log(e)
}
</script>
<template>
  <section class="settings-section">
    <!-- <div>
        <ButtonUi>Загрузить настройки</ButtonUi>
        <ButtonUi>Сохранить настройки</ButtonUi>
      </div> -->
    <div class="settings-block">
      <div class="settings-block-container">
        <!-- <SettingsElementUI
          title="Папка для получения файлов:"
          value="'folder dir'"
          buttonChild="+"
          @click="handleClick"
        ></SettingsElementUI> -->
        <SettingsElementUI
          title="разделитель:"
          value="'_'"
          buttonChild="+"
          @click="handleClick"
        ></SettingsElementUI>
      </div>
      <div class="settings-block-container">
        <!-- <SettingsElementUI
          title="Папка для неизвестных файлов:"
          value="'folder dir'"
          buttonChild="+"
          @click="handleClick"
        ></SettingsElementUI> -->
        <SettingsElementUI
          title="игнорируемые символы:"
          value="'—, -, ()'"
          buttonChild="+"
          @click="handleClick"
        ></SettingsElementUI>
      </div>
    </div>
    <div class="settings-block">
      <AddTegBlock></AddTegBlock>
      <div>поле поиска по тегам</div>
      <ul>
        <li>
          <SettingsElementUI title="Cmik" value="folder/link" button-child="+"></SettingsElementUI>
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
  padding: 5px;
  gap: 5px;
  inline-size: 100%;
  block-size: 100%;
}

.settings-block {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.settings-block-container {
    display: flex;
    gap: 5px;
    inline-size: 100%;
}
</style>
