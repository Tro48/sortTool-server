import type { ILogItem, UseLogs } from '@/types/types';
import { defineStore } from 'pinia';
import { BASE_URL } from './useSettingsStore';

export const useLogs = defineStore('logs', {
	state: (): UseLogs => ({
		logsList: new Map(),
	}),
	actions: {
		async fetchGetAllLogs() {
			try {
				const response = await fetch(BASE_URL + '/api/logs');
				const data: { [key: string]: ILogItem } = await response.json();
				Object.entries(data).forEach(([key, value]) => {
					this.logsList.set(key, value);
				});
			} catch (error) {
				console.error(error);
			}
		},
		setLogItem(log: ILogItem) {
			this.logsList.set(log.fileName, log);
		},
	},
});
