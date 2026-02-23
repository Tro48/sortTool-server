<script setup lang="ts">
import ButtonUi from './ButtonUi.vue'

const scriptStartState = true;
</script>
<template>
  <div class="controls-block">
    <ButtonUi tooltip="Остановить скрипт" v-if="scriptStartState"><v-icon>mdi-stop-circle-outline</v-icon></ButtonUi>
    <ButtonUi tooltip="Запустить скрипт" v-else><v-icon>mdi-play-circle-outline</v-icon></ButtonUi>
  </div>
</template>
<style scoped>
.controls-block{
    display: flex;
    justify-content: end;
    gap: 5px;
    padding: 5px;
}
</style>
