<script setup lang="ts">
const props = defineProps<{
	typeInput: 'separator' | 'ignoredChars' | 'tagsInput';
}>();
import { useSettings } from '@/stores/useSettingsStore';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watchEffect } from 'vue';
import ButtonUi from './ButtonUi.vue';
import FormUi from './FormUi.vue';
import Input from './Input.vue';
import InputFolders from './InputFolders.vue';
import SettingsElementsListUi from './SettingsElementsListUi.vue';
import SettingsPanelContainerUi from './SettingsPanelContainerUi.vue';

const settings = useSettings();
const { ignoredChars, pendingChars, separators, pendingSep, tagsDir } = storeToRefs(settings);

const { typeInput } = props;

const items = typeInput === 'separator' ? separators : ignoredChars;
const isPending = typeInput === 'separator' ? pendingSep : pendingChars;
const fetchSetter =
	typeInput === 'separator' ? settings.fetchSetSeparator : settings.fetchSetIgnoredChars;
const fetchRemover =
	typeInput === 'separator' ? settings.removeSeparatorItem : settings.removeIgnoredItem;
const placeholder =
	typeInput === 'separator' ? 'Введите разделитель' : 'Введите игнорируемый символ';

const forbiddenRegex = /^[^a-zA-Zа-яА-ЯёЁ0-9\s*\-\\]+$/;
const dataInput = ref('');
const errorData = ref('');
const folderInputData = ref('');
const dataInputTag = ref('');
const dataInputTagErrorMessage = ref('');

const handler =
	typeInput === 'tagsInput'
		? () => {
				if (!dataInput.value || !folderInputData.value) return;
				const tags = dataInput.value.replace(/\s+/g, '').split(',');
				const data = new Map<string, string>();
				tags.forEach((tag) => {
					data.set(tag, folderInputData.value);
				});
				settings.fetchSetTagsDir(data);
				dataInput.value = '';
				folderInputData.value = '';
			}
		: () => {
				if (!dataInput.value) return;
				fetchSetter(dataInput.value);
				dataInput.value = '';
			};

const onInputData = (value: string) => {
	dataInput.value = value;
};

const onInputTagData = (value: string) => {
	dataInputTag.value = value;
};

const validateTagInput = (value: string): boolean => {
	const dataArr = value.toUpperCase().replace(' ', '').split(',');
	return !dataArr.some((str) => tagsDir.value.has(str));
};

onMounted(() => {
	if (typeInput === 'separator') {
		settings.fetchSeparators();
	} else if (typeInput === 'ignoredChars') {
		settings.fetchIgnoredChars();
	} else if (typeInput === 'tagsInput') {
		settings.fetchAllTagsDir();
	}
});

watchEffect(() => {
	if (!forbiddenRegex.test(dataInput.value) && dataInput.value !== '') {
		errorData.value = 'Разрешены только символы, кроме букв, цифр и знаков - * \\';
	} else {
		errorData.value = '';
	}
	if (!validateTagInput(dataInputTag.value)) {
		dataInputTagErrorMessage.value = 'Такая цветовая схема уже существует';
	} else {
		dataInputTagErrorMessage.value = '';
	}
});
</script>

<template>
	<SettingsPanelContainerUi :type="typeInput">
		<FormUi :typeForm="typeInput" :handler="handler">
			<template v-if="typeInput === 'tagsInput'">
				<div class="input-group input-group-tag">
					<label class="input-header" for="tag-name">Цветовая схема:</label>
					<Input
						v-model="dataInput"
						id="tag-name"
						type="text"
						placeholder="CMYK, BL2..."
						@input="onInputTagData"
						:regex="validateTagInput"
						:errorMessage="dataInputTagErrorMessage"
					/>
				</div>
				<div class="input-group input-group-tag">
					<label class="input-header" for="tag-folder">Выбрать папку:</label>
					<div class="input-group-tag-button-block">
						<InputFolders v-model="folderInputData" placeholder="Выберите папку" />
						<ButtonUi
							:disabled="
								!dataInputTag ||
								dataInputTagErrorMessage.length > 0 ||
								!folderInputData
							"
							type="submit"
							><v-icon>mdi-tag-plus-outline</v-icon></ButtonUi
						>
					</div>
				</div>
			</template>
			<template v-else>
				<h3 class="input-header">
					Разделитель:
					<span
						><SettingsElementsListUi
							:delFunc="fetchRemover"
							:loader="isPending"
							:data="items"
							:skeletonCount="items.length"
					/></span>
				</h3>
				<div class="input-group">
					<Input
						v-model="dataInput"
						@input="onInputData"
						type="text"
						:placeholder="placeholder"
						maxlength="1"
						:errorMessage="errorData"
						:regex="forbiddenRegex"
					/>
					<ButtonUi :disabled="!dataInput || errorData.length > 0" type="submit"
						><v-icon>mdi-plus-circle-outline</v-icon></ButtonUi
					>
				</div>
			</template>
		</FormUi>
	</SettingsPanelContainerUi>
</template>
<style scoped>
.input-header {
	display: flex;
	align-items: center;
	gap: 5px;
	inline-size: 100%;
	min-block-size: 30px;
	font-size: 16px;
	font-weight: 600;
}
.input-group {
	display: flex;
	align-items: center;
	justify-content: center;
	inline-size: 100%;
	gap: 5px;
}

.input-group-tag {
	flex-direction: column;
}

.input-group-tag-button-block {
	display: flex;
	align-items: center;
	gap: 5px;
	justify-content: space-between;
	inline-size: 100%;
}
</style>
