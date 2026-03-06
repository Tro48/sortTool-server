<script setup lang="ts">
import { useSettings } from '@/stores/useSettingsStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, type Ref } from 'vue';
import ButtonUi from './ButtonUi.vue';
import Input from './Input.vue';
import InputFolders from './InputFolders.vue';
import SettingsElementsListUi from './SettingsElementsListUi.vue';
import WorkingWithFiles from './WorkingWithFiles.vue';

const settings = useSettings();
const { ignoredChars, pendingChars, separators, pendingSep, tagsDir, pendingTagsDir } =
	storeToRefs(settings);

const search = ref('');

const tagsEntries = computed(() => {
	const map = tagsDir.value ?? new Map<string, string>();
	const entries = Array.from(map.entries());
	const q = String(search.value || '')
		.trim()
		.toLowerCase();
	if (!q) return entries;
	return entries.filter(([k]) => {
		const key = String(k ?? '').toLowerCase();
		return key.includes(q);
	});
});

const separatorData = ref('');
const separatorDataInputErr = ref('');
const ignoredCharsData = ref('');
const ignoredCharsDataErr = ref('');
const folderInputData = ref('');
const tagInputData = ref('');

const validateInput = (
	value: string,
	valueState: Ref<string, string>,
	errorState: Ref<string, string>,
): void => {
	const char = value ? value.slice(-1) : '';
	const forbiddenRegex = /[a-zA-Zа-яА-Я0-9]|\-||\\/;

	if (forbiddenRegex.test(char) && char !== '') {
		errorState.value = 'Разрешены только символы, кроме букв, цифр и знаков "- * \\"';
		valueState.value = char;
	} else {
		errorState.value = '';
		valueState.value = char;
	}
};

const hendlerFormSeparator = () => {
	if (!separatorData.value) return;
	settings.fetchSetSeparator(separatorData.value);
	separatorData.value = '';
};

const onInputCharsData = (value: string) => {
	validateInput(value, ignoredCharsData, ignoredCharsDataErr);
};

const onInputSeparatorData = (value: string) => {
	validateInput(value, separatorData, separatorDataInputErr);
};

const hendlerFormignoredChars = () => {
	if (!ignoredCharsData.value) return;
	settings.fetchSetIgnoredChars(ignoredCharsData.value);
	ignoredCharsData.value = '';
};

const hendlerAddTags = () => {
	if (!tagInputData.value || !folderInputData.value) return;
	const tags = tagInputData.value.replace(/\s+/g, '').split(',');
	const data = new Map<string, string>();
	tags.forEach((tag) => {
		data.set(tag, folderInputData.value);
	});
	settings.fetchSetTagsDir(data);
	tagInputData.value = '';
	folderInputData.value = '';
};

onMounted(() => {
	settings.fetchIgnoredChars();
	settings.fetchSeparators();
	settings.fetchAllTagsDir();
});
</script>
<template>
	<section class="settings-section">
		<WorkingWithFiles />
		<div class="settings-blocks-container">
			<div class="settings-block">
				<form @submit.prevent @submit="hendlerFormSeparator" class="form">
					<h3 class="input-header">
						Разделитель:
						<span
							><SettingsElementsListUi
								:delFunc="settings.removeSeparatorItem"
								:loader="pendingSep"
								:data="separators"
								:skeletonCount="separators.length"
						/></span>
					</h3>
					<div class="input-group">
						<Input
							v-model="separatorData"
							@input="onInputSeparatorData"
							type="text"
							placeholder="_,-,!..."
							maxlength="1"
							:errorData="separatorDataInputErr"
						/>
						<ButtonUi type="submit"><v-icon>mdi-plus-circle-outline</v-icon></ButtonUi>
					</div>
				</form>
			</div>
			<div class="settings-block">
				<form class="form" @submit="hendlerFormignoredChars" @submit.prevent>
					<h3 class="input-header">
						Игнорируемые символы:
						<span
							><SettingsElementsListUi
								:delFunc="settings.removeIgnoredItem"
								:loader="pendingChars"
								:data="ignoredChars"
						/></span>
					</h3>
					<div class="input-group">
						<Input
							type="text"
							@input="onInputCharsData"
							v-model="ignoredCharsData"
							placeholder="&, P, +, %..."
							maxlength="1"
							:errorData="ignoredCharsDataErr"
						/>
						<ButtonUi type="submit"><v-icon>mdi-plus-circle-outline</v-icon></ButtonUi>
					</div>
				</form>
			</div>
			<div class="settings-block settings-block-tag">
				<form class="form form-tag" @submit.prevent @submit="hendlerAddTags">
					<div class="input-group input-group-tag">
						<label class="input-header" for="tag-name">Цветовая схема:</label>
						<Input
							v-model="tagInputData"
							id="tag-name"
							type="text"
							placeholder="CMYK, BL2..."
						/>
					</div>
					<div class="input-group input-group-tag">
						<label class="input-header" for="tag-folder">Выбрать папку:</label>
						<div class="input-group-tag-button-block">
							<InputFolders v-model="folderInputData" placeholder="Выберите папку" />
							<ButtonUi type="submit"><v-icon>mdi-tag-plus-outline</v-icon></ButtonUi>
						</div>
					</div>
				</form>
			</div>
		</div>
		<div class="tag-list-block">
			<div class="tag-list-header-block">
				<h3 class="input-header">Список цветовых схем:</h3>
				<Input type="search" placeholder="Поиск" v-model="search" />
			</div>
			<div v-if="tagsDir.size === 0" class="empty-message"><p>Тут пока ничего нет</p></div>
			<ul v-else-if="tagsDir" class="tag-list">
				<li class="tag-list-item" v-for="[key, value] in tagsEntries" :key="key">
					<span>{{ key }}</span>
					<span>{{ value }}</span>
					<ButtonUi
						type="button"
						@click="settings.removeTagItem(key)"
						customClass="delete-button"
						tooltip="Удалить цветовую схему"
					>
						<v-icon>mdi-close-circle-outline</v-icon>
					</ButtonUi>
				</li>
			</ul>
		</div>
	</section>
</template>

<style scoped>
.settings-section {
	display: flex;
	flex-direction: column;
	justify-content: start;
	gap: 5px;
	inline-size: 100%;
	block-size: 100%;
}

.settings-blocks-container {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 5px;
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

.form {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-end;
	gap: 5px;
}

.form-tag {
	flex-direction: row;
}

.input-header {
	display: flex;
	align-items: center;
	gap: 5px;
	inline-size: 100%;
	min-block-size: 30px;
	font-size: 16px;
	font-weight: 600;
}

.settings-block {
	display: flex;
	flex-direction: column;
	gap: 5px;
	inline-size: 100%;
	padding: 10px 10px 30px 10px;
	border: 1px solid var(--bg-color);
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
	background-color: var(--bg-color-section);
}

.settings-block-tag {
	grid-column: span 2;
}

.tag-list-block {
	display: flex;
	flex-direction: column;
	block-size: 100%;
	overflow: hidden;
	gap: 5px;
	padding: 5px;
	background-color: var(--bg-color-section);
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
	border-radius: 5px;
}

.tag-list-header-block {
	display: flex;
	align-items: center;
	padding: 5px;
	gap: 5px;
}

.empty-message {
	display: flex;
	justify-content: center;
	align-items: center;
	inline-size: 100%;
	block-size: 100%;
	border: 1px solid var(--bg-color);
	border-radius: 5px;
	color: var(--text-color);
	font-size: 14px;
}

.tag-list {
	display: flex;
	flex-direction: column;
	padding: 5px;
	gap: 5px;
	inline-size: 100%;
	block-size: 100%;
	overflow-y: auto;
	scroll-behavior: smooth;
	border: 1px solid var(--bg-color);
	border-radius: 5px;
	scrollbar-width: thin;
}

.tag-list-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 5px;
	inline-size: 100%;
	padding: 5px;
	border: 1px solid var(--bg-color);
	border-radius: 5px;
	cursor: pointer;
	transition: background-color 0.3s ease;
}
.tag-list-item > span {
	inline-size: 100%;
}

.tag-list-item:nth-child(2n) {
	background-color: var(--bg-color);
	transition: background-color 0.3s ease;
}

.tag-list-item:hover {
	background-color: var(--hover-page);
}
</style>
