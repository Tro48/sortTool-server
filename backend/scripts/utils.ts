import fs from 'fs';
import os from 'os';
import path from 'path';
import { DefaultEventsMap, Server } from 'socket.io';
import { SettingsFileData } from '../../src/types/types';
const rootDir = process.pkg ? path.dirname(process.execPath) : process.cwd();

export const settingsDir = process.pkg
	? path.join(rootDir, 'settings.json')
	: path.resolve(rootDir, './backend/settings.json');

export const logsDir = process.pkg
	? path.join(rootDir, 'logs.json')
	: path.resolve(rootDir, './backend/logs.json');

export const configPath = process.pkg
	? path.join(rootDir, 'config.json')
	: path.resolve(rootDir, './backend/config.json');

const messageStore = new Map();
const platform = os.platform();
const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sendLog = (
	message: string,
	state: 'pending' | 'pass' | 'error' | 'globalError',
	fileName: string,
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
	messageStore: Map<string, { fileName: string; state: string; message: string }>,
) => {
	const date = new Date();
	if (state === 'globalError') {
		io.emit('error', message);
	} else {
		messageStore.set(fileName, {
			fileName,
			state,
			message:
				date.toLocaleDateString('ru-RU', {
					hour: 'numeric',
					minute: 'numeric',
					second: 'numeric',
				}) +
				' ' +
				message,
		});
		io.emit('log', messageStore.get(fileName)); // Отправка на фронт
	}
};

export const watchNewFolder = (
	settingsData: SettingsFileData,
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
) => {
	fs.watch(settingsData.foldersDir, (evt, fileName) => {
		if (evt === 'rename' && fileName) {
			const fullPath = path.join(settingsData.foldersDir, fileName);

			// Проверяем, существует ли объект и является ли он папкой
			fs.stat(fullPath, (err, stats) => {
				if (!err && stats.isDirectory()) {
					io.emit('newFolderAadd', { newFolder: true });
				}
			});
		}
	});
};

export const getFileName = (dir: string) =>
	dir.split(platform === 'win32' ? '\\' : '/').slice(-1)[0];

export const getDb = (): { settingsData: SettingsFileData; logsData: Record<string, string> } => {
	let settingsData: SettingsFileData = {
		foldersDir: '',
		ignoredChars: [],
		separators: '',
		tagsDir: {},
		listenDir: '',
		ignoredNames: [],
	};

	let logsData = {};
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

export const calculateNewDir = (dir: string): string => {
	const { settingsData } = getDb();
	const separatorDir = platform === 'win32' ? '\\' : '/';
	let newDir = '';
	try {
		const settings: SettingsFileData = settingsData;
		const ignoredCharData = settings.ignoredChars
			.map((data) => escapeRegExp(data.value))
			.join('');
		const pattern = new RegExp(`[- \\${ignoredCharData}]`, 'g');
		const fileName = dir.split(separatorDir).slice(-1)[0];
		if (fileName === '.DS_Store') return '';
		const separator = settings.separators;
		const tags = Object.keys(settings.tagsDir);
		if (!fileName) return '';
		const fileNameArr = fileName.replace(pattern, separator).toUpperCase().split(separator);
		const arrTag = fileNameArr.filter((part) =>
			tags.some((key) => key.split(separator).includes(part)),
		);
		let tag;
		if (arrTag.length === 1) {
			tag = arrTag[0];
			newDir =
				settings.foldersDir +
				settings.tagsDir[tag] +
				separatorDir +
				fileName.replaceAll(' ', separator);
		} else if (arrTag.length > 1) {
			tag = arrTag.join(separator);
			if (settings.tagsDir[tag]) {
				newDir =
					settings.foldersDir +
					settings.tagsDir[tag] +
					separatorDir +
					fileName.replaceAll(' ', separator);
			} else {
				tag = arrTag.reverse().join(separator);
				console.log(tag);
				newDir =
					settings.foldersDir +
					settings.tagsDir[tag] +
					separatorDir +
					fileName.replaceAll(' ', separator);
			}
		} else {
			newDir = '';
		}
	} catch (error) {
		console.error(error);
	}
	return newDir;
};

const setLogDataFile = (
	fileName: string,
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
) => {
	try {
		const jsonFileData: string = fs.readFileSync(logsDir, 'utf8');
		const logs = JSON.parse(jsonFileData);
		logs[fileName] = messageStore.get(fileName);
		fs.writeFileSync(logsDir, JSON.stringify(logs, null, 2), 'utf8');
		messageStore.delete(fileName);
	} catch (error) {
		console.log(error);
		sendLog(`Ошибка записи файла ${error}`, 'globalError', fileName, io, messageStore);
	}
};

export async function copyFile(
	path: string,
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
) {
	const fileName = getFileName(path);
	const fileFormat = fileName.split('.');
	if (fileFormat[fileFormat.length - 1] !== 'pdf') return;
	const { settingsData } = getDb();
	if (settingsData.ignoredNames.includes(fileName)) return;
	const newFileDir = calculateNewDir(path);
	if (newFileDir) {
		try {
			fs.copyFile(path, newFileDir, (err) => {
				if (err) {
					sendLog('Ожидание...', 'pending', fileName, io, messageStore);
					return;
				}
				fs.unlink(path, (err) => {
					if (err) {
						console.error(err);
						sendLog(
							`Ошибка удаления ${err}`,
							'globalError',
							fileName,
							io,
							messageStore,
						);
						return;
					}
					const newFileDirArr = newFileDir.split(platform === 'win32' ? '\\' : '/');
					const folder = newFileDirArr[newFileDirArr.length - 2];
					sendLog(`Файл отправлен в папку ${folder}`, 'pass', fileName, io, messageStore);
					setLogDataFile(fileName, io);
				});
			});
			// oxlint-disable-next-line no-unused-vars
		} catch (err) {
			sendLog(`Ошибка отправки: ${err}`, 'error', fileName, io, messageStore);
			setLogDataFile(fileName, io);
		}
	} else {
		fs.unlink(path, (err) => {
			if (err) {
				console.error(err);
				sendLog(`Ошибка удаления файла ${err}`, 'globalError', fileName, io, messageStore);
				return;
			}
			sendLog(
				'В имени файла отсутствует цветовая схема для поиска. Измените имя файла и попробуйте снова',
				'error',
				fileName,
				io,
				messageStore,
			);
			setLogDataFile(fileName, io);
		});
	}
}
