
<script setup lang="ts">
import type { PropType } from 'vue'

const props = defineProps({
  type: {
    type: String as PropType<'line' | 'avatar' | 'rect'>,
    default: 'line'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  }
})

</script>

<template>
  <div
    :class="['skeleton', props.type]"
    :style="{ width: props.width, height: props.height }"
  ></div>
</template>

<style scoped>
.skeleton {
  background: #eee;
  background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
  background-size: 200% 100%;
  animation: shine 1.5s linear infinite;
}

.line { border-radius: 4px; }
.avatar { border-radius: 50%; }
.rect { border-radius: 8px; }

@keyframes shine {
  to { background-position-x: -200%; }
}
</style>
