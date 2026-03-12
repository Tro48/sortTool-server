import type { ILogItem, SettingsFileData } from '@/types/types';
import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
export const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_PORT}`: ''

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
	isSettingsDirState: boolean;
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
		isSettingsDirState: false,
	}),
	actions: {
		async fetchIgnoredChars() {
			this.pendingChars = true;
			try {
				const response = await fetch(BASE_URL + '/api/ignoredChars');
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
				const response = await fetch(BASE_URL + '/api/separators');
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
				const response = await fetch(BASE_URL + '/api/separators/set/', {
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
				const response = await fetch(BASE_URL + '/api/ignoredChars/set/', {
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
				const response = await fetch(BASE_URL + '/api/tagsDir');
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
				const response = await fetch(BASE_URL + '/api/folders');
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
				const response = await fetch(BASE_URL + '/api/tagsDir/set/', {
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
				const response = await fetch(BASE_URL + '/api/tagsDir/delete/', {
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
				const response = await fetch(BASE_URL + '/api/ignoredChars/delete/', {
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
				const response = await fetch(BASE_URL + '/api/separators/delete/', {
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
				const response = await fetch(BASE_URL + '/api/settings/upload', {
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
					if (!foldersDir && !listenDir) {
						this.isSettingsDirState = false;
					}
					this.isSettingsDirState = true;
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
				const response = await fetch(BASE_URL + '/api/settings/download', { method: 'GET' });
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
		async fetchSettingsDirState() {
			try {
				const response = await fetch(BASE_URL + '/api/settings/status', { method: 'GET' });
				if (response.ok) {
					this.isSettingsDirState = true;
				} else {
					this.isSettingsDirState = false;
				}
			} catch (error) {
				console.error('Ошибка:', error);
			}
		},
		async fetchAddFoldersDir(foldersDirData: { foldersDir: string; listenDir: string }) {
			try {
				const response = await fetch(BASE_URL + '/api/settings/setFoldersDir', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(foldersDirData),
				});
				if (response.ok) {
					this.fetchSettingsDirState();
				}
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

export const useSocket = defineStore('socket', {
	state: () => ({
		socket: io(BASE_URL, { autoConnect: true }),
		scriptState: '',
	}),
	actions: {
		onLog(cb: (log: ILogItem) => void) {
			this.socket.on('log', (data) => {
				cb(data);
			});
		},
		onNewFolder(cb: () => void) {
			this.socket.on('newFolderAadd', (_) => {
				cb();
			});
		},
		onScriptListenerState() {
			this.socket.on('scriptStart', (data) => {
				console.log(data);
				this.scriptState = data;
			});
			this.socket.on('scriptStop', (data) => {
				console.log(data);
				this.scriptState = data;
			});
		},
	},
});
