import { defineStore } from 'pinia';
const apiUrl = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_PORT}/api/`;

interface ISettingsState {
	ignoredChars: { id: string; value: string }[];
	pendingChars: boolean;
	separators: { id: string; value: string }[];
	pendingSep: boolean;
	tagsDir: Map<string, string>;
	pendingTagsDir: boolean;
	folders: string[];
	pendingFolders: boolean;
}

export const useSettings = defineStore('settingsStore', {
	state: (): ISettingsState => ({
		ignoredChars: [],
		pendingChars: false,
		separators: [],
		pendingSep: false,
		tagsDir: new Map(),
		pendingTagsDir: false,
		folders: [],
		pendingFolders: false,
	}),
	actions: {
		async fetchIgnoredChars() {
			this.pendingChars = true;
			try {
				const response = await fetch(apiUrl + 'ignoredChars');
				this.ignoredChars = await response.json();
			} catch (error) {
				console.error('chars fetch error', error);
			} finally {
				this.pendingChars = false;
			}
		},
		async fetchSeparators() {
			this.pendingSep = true;
			try {
				const response = await fetch(apiUrl + 'separators');
				const data = await response.json();
				this.separators = [...data];
			} catch (error) {
				console.error('Ошибка:', error);
			} finally {
				this.pendingSep = false;
			}
		},
		async fetchSetSeparator(sepData: string) {
			this.pendingSep = true;
			try {
				const response = await fetch(apiUrl + 'separators/set/', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ value: sepData }),
				});
				const data = await response.json();
				this.separators.push(data);
			} catch (error) {
				console.error('Ошибка:', error);
			} finally {
				this.pendingSep = false;
			}
		},
		async fetchSetIgnoredChars(ignoredCharData: string) {
			this.pendingChars = true;
			try {
				const response = await fetch(apiUrl + 'ignoredChars/set/', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ value: ignoredCharData }),
				});
				const data = await response.json();
				this.ignoredChars.push(data);
			} catch (error) {
				console.error('Ошибка:', error);
			} finally {
				this.pendingChars = false;
			}
		},
		async fetchAllTagsDir() {
			this.pendingTagsDir = true;
			try {
				const response = await fetch(apiUrl + 'tagsDir');
				const data = await response.json();
				this.tagsDir = new Map(
					Object.entries(data).map(([key, value]) => [
						key,
						value as string,
					]),
				);
			} catch (error) {
				console.error('Ошибка:', error);
			} finally {
				this.pendingTagsDir = false;
			}
		},
		async fetchAllFolders() {
			this.pendingFolders = true;
			try {
				this.folders = await (await fetch(apiUrl + 'folders')).json();
			} catch (error) {
				console.error('Ошибка:', error);
			} finally {
				this.pendingFolders = false;
			}
		},
		async fetchSetTagsDir(tagsDirData: Map<string, string>) {
			this.pendingTagsDir = true;
			try {
				const response = await fetch(apiUrl + 'tagsDir/set/', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(Object.fromEntries(tagsDirData)),
				});
				const data: { [key: string]: string } = await response.json(); // ожидается объект { key: value }
				// если сервер вернул объект, итерируем пары и устанавливаем в Map
				if (data && typeof data === 'object') {
					if (data.error) {
						return;
					}
					Object.entries(data).forEach(([key, value]) => {
						this.tagsDir.set(key, value);
					});
				}
			} catch (error) {
				console.error('Ошибка:', error);
			} finally {
				this.pendingTagsDir = false;
			}
		},
	},
	getters: {
		getFolders: (state) => {
			if (Array.isArray(state.folders)) {
				return state.folders.map((item: string) => ({
					label: item,
					value: item,
				}));
			}
			return [];
		},
	},
});
