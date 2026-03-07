import type { SettingsFileData } from '@/types/types';
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
	isUploadSettings: boolean;
	isDownloadSettings: boolean;
	foldersDir: string;
	listenDir: string;
	isStartScript: boolean;
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
		isUploadSettings: false,
		isDownloadSettings: false,
		foldersDir: '',
		listenDir: '',
		isStartScript: false,
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
				this.separators = [{ id: data, value: data }];
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
				this.separators = [{ id: data, value: data }];
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
					Object.entries(data).map(([key, value]) => [key, value as string]),
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
				const response = await fetch(apiUrl + 'folders');
				if (response.ok) {
					this.folders = await response.json();
				} else {
					this.folders = [];
				}
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
		async removeTagItem(id: string) {
			this.pendingTagsDir = true;
			try {
				const response = await fetch(apiUrl + 'tagsDir/delete/', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id }),
				});
				if (response.ok) {
					this.fetchAllTagsDir();
				}
			} catch (error) {
				console.error('Ошибка:', error);
			} finally {
				this.pendingTagsDir = false;
			}
		},
		async removeIgnoredItem(id: string) {
			this.pendingChars = true;
			try {
				const response = await fetch(apiUrl + 'ignoredChars/delete/', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id }),
				});
				if (response.ok) {
					this.fetchIgnoredChars();
				}
			} catch (error) {
				console.error('Ошибка:', error);
			} finally {
				this.pendingChars = false;
			}
		},
		async removeSeparatorItem(id: string) {
			this.pendingSep = true;
			try {
				const response = await fetch(apiUrl + 'separators/delete/', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ id }),
				});
				if (response.ok) {
					this.fetchSeparators();
				}
			} catch (error) {
				console.error('Ошибка:', error);
			} finally {
				this.pendingSep = false;
			}
		},
		async fetchUploadSettings(data: SettingsFileData) {
			this.isUploadSettings = true;
			try {
				const response = await fetch(apiUrl + 'settings/upload', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data),
				});
				if (response.ok) {
					const {
						foldersDir,
						ignoredChars,
						separators,
						tagsDir,
						listenDir,
					}: SettingsFileData = await response.json();
					this.foldersDir = foldersDir;
					this.ignoredChars = ignoredChars;
					this.separators = [{ id: separators, value: separators }];
					this.tagsDir = new Map<string, string>();
					Object.entries(tagsDir).forEach(([key, value]) => {
						this.tagsDir.set(key, value);
					});
					this.listenDir = listenDir;
				}
			} catch (error) {
				console.error('Ошибка:', error);
			} finally {
				this.isUploadSettings = false;
			}
		},
		async fetchDownloadSettings() {
			try {
				const response = await fetch(apiUrl + 'settings/download', { method: 'GET' });
				if (!response.ok) {
					throw new Error('Ошибка загрузки файла');
				}
				const blob = await response.blob();
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'settings.json';
				document.body.appendChild(a);
				a.click();
				a.remove();
				window.URL.revokeObjectURL(url);
			} catch (error) {
				console.error('Ошибка:', error);
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
