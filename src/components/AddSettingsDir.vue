<script setup lang="ts">
import { useSettings } from '@/stores/useSettingsStore';
import { storeToRefs } from 'pinia';
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
	gap: 5px;
	padding: 25%;
	inline-size: 100%;
	block-size: 90vh;
}

.title {
	font-size: 18px;
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
	font-size: 16px;
	color: var(--text-color);
}

.input-block {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	gap: 10px;
	border: 1px solid var(--bg-color);
	border-radius: 5px;
	padding: 5px;
}

.input-group {
	display: flex;
	inline-size: 100%;
	flex-direction: column;
	gap: 5px;
}

.input-group > label {
	font-size: 14px;
	color: var(--text-color);
}

.button {
	inline-size: fit-content;
	background-color: var(--active);
	color: var(--bg-color-section);
	font-size: 14px;
	padding: 5px;
	border-radius: 5px;
}

.button:hover {
	background-color: var(--hover-menu-button);
}
</style>
