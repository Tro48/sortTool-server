<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue';

const props = defineProps<{
	modelValue: { type: [string, number]; default: '' };
	type: InputTypeHTMLAttribute;
	id?: string;
	placeholder: string;
	maxlength?: string;
	errorData?: string;
}>();

const model = defineModel();

const emit = defineEmits(['update:modelValue', 'input', 'change']);

function onInput(e: Event) {
	const val = (e.target as HTMLInputElement).value;
	emit('update:modelValue', val);
	emit('input', val);
}
</script>
<template>
	<div class="input-container">
		<input
			v-model="model"
			:id="id"
			:type="type"
			:placeholder="placeholder"
			:value="modelValue"
			@input="onInput"
			class="input"
			maxlength="maxlength"
		/>
		<p class="input-error-message" v-if="errorData">{{ errorData }}</p>
		<p class="input-error-message" v-else></p>
	</div>
</template>
<style scoped>

.input-container {
  position: relative;
  display: flex;
  flex-direction: column;
  inline-size: 100%;
}

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

.input-error-message {
  position: absolute;
  block-size: 16px;
  bottom: -20px;
  left: 0;
  color: red;
}
</style>
