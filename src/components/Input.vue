<script setup lang="ts">
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  id: String,
  placeholder: String,
})

const emit = defineEmits(['update:modelValue', 'input', 'change'])

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', val)
  emit('input', val)
}
</script>
<template>
  <input
    :id="id"
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    @input="onInput"
    class="input"
  />
</template>
<style scoped>
.input {
  background-color: var(--bg-color);
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
  width: 100%;
}

.input:focus {
  outline: 1px solid var(--text-color);
}
</style>
