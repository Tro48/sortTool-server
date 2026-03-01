<script setup lang="ts">
import ButtonUi from '@/components/ButtonUi.vue';
import { useSettings, type SettingsFileData } from '@/stores/useSettingsStore';
import { ref } from 'vue';

const emit = defineEmits<{
	(e: 'start'): void;
	(e: 'success', data: any): void;
	(e: 'error', err: unknown): void;
}>();

const settings = useSettings();

const inputRef = ref<HTMLInputElement | null>(null);
const loading = ref(false);

function openPicker() {
	inputRef.value?.click();
}

async function onChange(e: Event) {
	const file = (e.target as HTMLInputElement).files?.[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = (e) => {
		try {
			const data: SettingsFileData = JSON.parse(e.target?.result as string);
			settings.fetchUploadSettings(data);
		} catch (error) {
			console.error('Error parsing JSON:', error);
		}
	};
	reader.readAsText(file);
}
</script>

<template>
	<div class="settings-dw-block">
		<input
			ref="inputRef"
			class="visually-hidden"
			type="file"
			accept=".json"
			@change="onChange"
		/>
		<ButtonUi
			tooltip="Загрузить файл с настройками"
			@click="openPicker"
			:disabled="loading"
			type="button"
			><v-icon>mdi-file-download-outline</v-icon></ButtonUi
		>
		<ButtonUi
			type="button"
			@click="settings.fetchDownloadSettings"
			tooltip="Сохранить файл с настройками"
			><v-icon>mdi-file-upload-outline</v-icon></ButtonUi
		>
	</div>
</template>

<style scoped>
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

.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0 0 0 0);
	white-space: nowrap;
	border: 0;
}
</style>
