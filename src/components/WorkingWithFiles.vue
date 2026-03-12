<script setup lang="ts">
import ButtonUi from '@/components/ButtonUi.vue';
import { useSettings } from '@/stores/useSettingsStore';
import { type SettingsFileData } from '@/types/types';
import { ref, toRef } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
	isDownloadButton: { type: Boolean, default: false },
	customClass: { type: String, default: '' },
});
const isDownloadButton = toRef(props, 'isDownloadButton');
const customClass = toRef(props, 'customClass');
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
	reader.onload = async (e) => {
		try {
			const data: SettingsFileData = JSON.parse(e.target?.result as string);
			await settings.fetchUploadSettings(data);
			await settings.fetchSettingsDirState();
			router.push({ name: 'Home' });
		} catch (error) {
			console.error('Error parsing JSON:', error);
		}
	};
	reader.readAsText(file);
}
</script>

<template>
	<div class="settings-dw-block" :class="customClass">
		<slot></slot>
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
			v-if="isDownloadButton"
			type="button"
			@click="settings.fetchDownloadSettings"
			tooltip="Сохранить файл с настройками"
			><v-icon>mdi-file-upload-outline</v-icon></ButtonUi
		>
	</div>
</template>

<style>
.settings-dw-block {
	display: flex;
	justify-content: end;
	align-items: center;
	gap: var(--gap-page);
	inline-size: var(--inline-size-full);
	padding: var(--padding-page);
	background-color: var(--bg-color-section);
	border-radius: var(--br-page);
	box-shadow: var(--shadow);
}
</style>
