<script setup lang="ts">
import ButtonUi from './ButtonUi.vue'
 </script>
<template>
  <div>
    <h4>добавление тега:</h4>
    <form action="">
      <label for="tag">Укажите тег</label>
      <input id="tag" type="text" placeholder="CMY, CMYK, BL2" />
      <label for="folder">Добавьте папку:</label>
      <input id="folder" type="text" placeholder="C:\folder" />
      <input type="file" webkitdirectory />
      <ButtonUi type="submit">+</ButtonUi>
    </form>
  </div>
</template>
<style scoped></style>
