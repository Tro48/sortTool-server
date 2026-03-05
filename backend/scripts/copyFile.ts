import fs from 'fs';
import os from 'os';
import { calculateNewDir } from './calculateNewDir';
const logsDir = 'backend/db/logs.json';
const platform = os.platform();

export async function copyFile(
	path: string,
	sendMessage: (
		message: string,
		state: 'pending' | 'pass' | 'error' | 'globalError',
		fileName: string,
	) => void,
	fileName: string,
	messageStore: Map<string, { fileName: string; state: string; message: string }>,
) {
	const newFileDir = calculateNewDir(path);
	if (newFileDir) {
		try {
			fs.copyFile(path, newFileDir, (err) => {
				if (err) {
					sendMessage('Ожидание...', 'pending', fileName);
					return;
				}
				fs.unlink(path, (err) => {
					if (err) {
						console.error(err);
						sendMessage(`Ошибка удаления ${err}`, 'globalError', fileName);
						return;
					}
					const newFileDirArr = newFileDir.split(platform === 'win32' ? '\\' : '/');
					const folder = newFileDirArr[newFileDirArr.length - 2];
					sendMessage(`Файл отправлен в папку ${folder}`, 'pass', fileName);
					fs.readFile(logsDir, 'utf8', (err, data) => {
						if (err) {
							console.error(err);
							sendMessage(`Ошибка чтения ${err}`, 'globalError', fileName);
							return;
						}
						const logsList = JSON.parse(data);
						logsList[fileName] = messageStore.get(fileName);
						fs.writeFile(logsDir, JSON.stringify(logsList), 'utf8', (err) => {
							if (err) {
								console.error(err);
								sendMessage(`Ошибка записи файла ${err}`, 'globalError', fileName);
							}
							messageStore.delete(fileName);
						});
					});
				});
			});
			// oxlint-disable-next-line no-unused-vars
		} catch (err) {
			sendMessage(`Ошибка отправки: ${err}`, 'error', fileName);
			fs.readFile(logsDir, 'utf8', (err, data) => {
				if (err) {
					console.error(err);
					sendMessage(`Ошибка чтения файла ${err}`, 'globalError', fileName);
					return;
				}
				const logsList = JSON.parse(data);
				logsList[fileName] = messageStore.get(fileName);
				fs.writeFile(logsDir, JSON.stringify(logsList), 'utf8', (err) => {
					if (err) {
						console.error(err);
						sendMessage(`Ошибка записи файла ${err}`, 'globalError', fileName);
					}
					messageStore.delete(fileName);
				});
			});
		}
	} else {
		fs.unlink(path, (err) => {
			if (err) {
				console.error(err);
				sendMessage(`Ошибка удаления файла ${err}`, 'globalError', fileName);
				return;
			}
			sendMessage(
				'В имени файла отсутствует цветовая схема для поиска. Измените имя файла и попробуйте снова',
				'error',
				fileName,
			);
			fs.readFile(logsDir, 'utf8', (err, data) => {
				if (err) {
					console.error(err);
					sendMessage(`Ошибка чтения файла ${err}`, 'globalError', fileName);
					return;
				}
				const logsList = JSON.parse(data);
				logsList[fileName] = messageStore.get(fileName);
				fs.writeFile(logsDir, JSON.stringify(logsList), 'utf8', (err) => {
					if (err) {
						console.error(err);
						sendMessage(`Ошибка записи файла ${err}`, 'globalError', fileName);
					}
					messageStore.delete(fileName);
				});
			});
		});
	}
}
