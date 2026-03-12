<script setup lang="ts">
import { useSettings } from '@/stores/useSettingsStore';
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import ButtonUi from './ButtonUi.vue';
import Input from './Input.vue';
import SettingsPanelContainerUi from './SettingsPanelContainerUi.vue';
import WorkingWithFiles from './WorkingWithFiles.vue';

const settings = useSettings();
const router = useRouter();

const inputDataRootFolderDir = ref('');
const inputDataListenFolderDir = ref('');
const validateState = ref(true);
const pathLastChar = /.*[/\\]$/;
const pattern = /^([a-zA-Z]:[/\\]|[/\\])/;

const validate = (value: string) => {
	return pattern.test(value) && pathLastChar.test(value);
};

const handlerInputRootFolder = (value: string) => {
	inputDataRootFolderDir.value = value;
};

const handlerInputListenFolder = (value: string) => {
	inputDataListenFolderDir.value = value;
};

watchEffect(() => {
	if (!inputDataRootFolderDir.value && !inputDataListenFolderDir.value) {
		validateState.value = true;
		return;
	}
	validateState.value = !(
		validate(inputDataRootFolderDir.value) === validate(inputDataListenFolderDir.value)
	);
});

const handler = async () => {
	if (validateState.value) return;
	const data = {
		foldersDir: inputDataRootFolderDir.value,
		listenDir: inputDataListenFolderDir.value,
	};
	try {
		await settings.fetchAddFoldersDir(data);

		router.push({ name: 'Home' });
	} catch (error) {
		console.error(error);
	}
};
</script>
<template>
	<section class="add-settings-dir-section">
		<SettingsPanelContainerUi type="default">
			<h1 class="title">
				Для работы программы необходимо загрузить настройки или указать директории папок
			</h1>
		</SettingsPanelContainerUi>
		<SettingsPanelContainerUi type="default">
			<WorkingWithFiles :customClass="'download-settings'">
				<h3 class="download-settings-title">Загрузить настройки:</h3>
			</WorkingWithFiles>
			<form @submit.prevent @submit="handler" class="input-block">
				<div class="input-group">
					<label for="folderListen">Папка отслеживания новых файлов:</label>
					<Input
						v-model="inputDataListenFolderDir"
						@input="handlerInputListenFolder"
						type="text"
						id="folderListen"
						placeholder="Введите адрес папки"
						:regex="validate"
					/>
				</div>
				<div class="input-group">
					<label for="folderRoot">Папка назначения:</label>
					<Input
						v-model="inputDataRootFolderDir"
						@input="handlerInputRootFolder"
						type="text"
						id="folderRoot"
						placeholder="Введите адрес папки"
						:regex="validate"
					/>
				</div>
				<ButtonUi :disabled="validateState" customClass="button" type="submit"
					>Сохранить</ButtonUi
				>
			</form>
		</SettingsPanelContainerUi>
	</section>
</template>
<style scoped>
.add-settings-dir-section {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: var(--gap-page);
	padding: var(--padding-settings-dir-page);
	inline-size: var(--inline-size-full);
	block-size: 90vh;
}

.title {
	font-size: var(--font-size-big);
	color: var(--text-color);
	text-align: center;
}

.download-settings {
	display: flex;
	justify-content: space-between;
	box-shadow: none;
	border: 1px solid var(--bg-color);
}

.download-settings-title {
	font-size: var(--font-size-medium);
	color: var(--text-color);
}

.input-block {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: calc(var(--gap-page) * 2);
	border: 1px solid var(--bg-color);
	border-radius: var(--br-page);
	padding: var(--padding-page);
}

.input-group {
	display: flex;
	inline-size: var(--inline-size-full);
	flex-direction: column;
	gap: var(--gap-page);
}

.input-group > label {
	font-size: var(--font-size-normal);
	color: var(--text-color);
}

.button {
	inline-size: fit-content;
	background-color: var(--active);
	color: var(--bg-color-section);
	font-size: var(--font-size-normal);
	padding: var(--padding-page);
	border-radius: var(--br-page);
}

.button:hover {
	background-color: var(--hover-menu-button);
}
</style>
