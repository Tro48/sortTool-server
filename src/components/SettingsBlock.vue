<script setup lang="ts">
import { useSettings } from '@/stores/useSettingsStore';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import ButtonUi from './ButtonUi.vue';
import Input from './Input.vue';
import SettingsInputPanel from './SettingsInputPanel.vue';
import WorkingWithFiles from './WorkingWithFiles.vue';

const settings = useSettings();
const { tagsDir } = storeToRefs(settings);

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
</script>
<template>
	<section class="settings-section">
		<WorkingWithFiles isDownloadButton />
		<div class="settings-blocks-container">
			<SettingsInputPanel typeInput="separator" />
			<SettingsInputPanel typeInput="ignoredChars" />
			<SettingsInputPanel typeInput="tagsInput" />
		</div>
		<div class="tag-list-block">
			<div class="tag-list-header-block">
				<h3 class="input-header">Список цветовых схем:</h3>
				<div>
					<Input type="search" placeholder="Поиск" v-model="search" />
				</div>
			</div>
			<div v-if="tagsDir.size === 0" class="empty-message"><p>Тут пока ничего нет</p></div>
			<ul v-else-if="tagsDir" class="tag-list">
				<li class="tag-list-item" v-for="[key, value] in tagsEntries" :key="key">
					<span>{{ key }}</span>
					<span>{{ value }}</span>
					<ButtonUi
						type="button"
						:disabled="true"
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
