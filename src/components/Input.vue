<script setup lang="ts">
import { computed, type InputTypeHTMLAttribute } from 'vue';

const props = defineProps<{
	modelValue?: string;
	type: InputTypeHTMLAttribute;
	id?: string;
	placeholder: string;
	maxlength?: string;
	errorMessage?: string;
	regex?: RegExp | ((value: string) => boolean);
}>();
const model = defineModel<string>();

const emit = defineEmits(['update:modelValue', 'input', 'change']);

const isValid = computed(() => {
	if (!props.regex) return true;
	if (typeof props.regex === 'function') return props.regex(model.value ?? '');
	return props.regex.test(String(model.value ?? ''));
});

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
			@input="onInput"
			:class="['input', { 'input-error': !isValid }]"
			:maxlength="maxlength"
		/>
		<p class="input-error-message" v-if="!isValid">{{ errorMessage }}</p>
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

.input-error:focus {
	outline: 1px solid red;
}

.input-error-message {
	position: absolute;
	block-size: 16px;
	bottom: -20px;
	left: 0;
	color: red;
}
</style>
