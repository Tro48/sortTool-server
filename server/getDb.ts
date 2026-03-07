import fs from 'fs';
import { SettingsFileData, UseLogs } from '../src/types/types';

export const getDb = ({
	settingsDir,
	logsDir,
}: {
	settingsDir: string;
	logsDir: string;
}): { settingsData: SettingsFileData; logsData: UseLogs } => {
	let settingsData: SettingsFileData = {
		foldersDir: '',
		ignoredChars: [],
		separators: '',
		tagsDir: {},
		listenDir: '',
	};

	let logsData: UseLogs = {
		logsList: new Map(),
	};
	try {
		if (fs.existsSync(settingsDir)) {
			const settingsFile = fs.readFileSync(settingsDir, 'utf-8');
			settingsData = Object.assign(settingsData, JSON.parse(settingsFile));
		} else {
			fs.writeFileSync(settingsDir, JSON.stringify(settingsData));
		}

		if (fs.existsSync(logsDir)) {
			const logsFile = fs.readFileSync(logsDir, 'utf-8');
			logsData = Object.assign(logsData, JSON.parse(logsFile));
		} else {
			fs.writeFileSync(logsDir, JSON.stringify(logsData));
		}
	} catch (error) {
		console.error('Ошибка при чтении данных из файлов:', error);
	}
	return { settingsData, logsData };
};
