<script lang="ts">
import ButtonUi from './ButtonUi.vue'
export default {
  components: { ButtonUi }
}
</script>
<template>
  <div class="controls-block">
    <ButtonUi>Старт</ButtonUi>
    <ButtonUi>Стоп</ButtonUi>
  </div>
</template>
<style scoped>
.controls-block{
    display: flex;
    justify-content: end;
    gap: 5px;
    padding: 5px;
    inline-size: 100%;
}
</style>
