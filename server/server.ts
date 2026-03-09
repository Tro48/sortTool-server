import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { delayedClear } from '../backend/scripts/clearLog';
import { getDb } from '../backend/scripts/utils';
import { deleteSettings, getSettings, setSettings } from './methods';
import { CheckerFiles } from '../backend/scripts/checkerFiles';
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const port = process.env.VITE_PORT;
const settingsFileDir = 'backend/db/settings.json';
const logsDir = 'backend/db/logs.json';
const checkerFolder = new CheckerFiles(io)
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
delayedClear(logsDir, THREE_DAYS_MS);

const { settingsData } = getDb();

	if (!settingsData.foldersDir || !settingsData.listenDir) {
		io.emit('errorFolderDir', 'Не указаны деректория папок или листен директория');
	} else {
		checkerFolder.setNewDir(settingsData.foldersDir);
	}

const settingsKeys = {
	separators: 'separators',
	ignoredChars: 'ignoredChars',
	tagsDir: 'tagsDir',
	logs: 'logs',
	foldersDir: 'foldersDir',
	listenDir: 'listenDir',
};

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

io.on('connection', (_socket) => {
	console.log('Фронтенд подключился');
});

app.get('/api/folders', (_, res) => {
	const _settings = JSON.parse(fs.readFileSync(settingsFileDir, 'utf-8'));
	if (!_settings.foldersDir) {
		return res.status(500).json({ error: 'Путь к папкам не задан' });
	} else {
		const dirPath = path.join(_settings.foldersDir ? _settings.foldersDir : '');
		fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
			if (err) return res.status(500).json({ error: `ошибка чтения ${err}` });
			const folders = files
				.filter((dirent) => dirent.isDirectory())
				.map((dirent) => dirent.name)
				.filter((dirName) => {
					if (
						dirName === '$cep_hf$' ||
						dirName === 'error' ||
						dirName === 'Exported' ||
						dirName === 'Fonts' ||
						dirName === 'indigo1' ||
						dirName === 'indigo2' ||
						dirName === 'JDF' ||
						dirName === 'LabelsAndPackaging' ||
						dirName === 'press' ||
						dirName === 'success'
					)
						return false;
					return dirName;
				});
			res.json(folders);
		});
	}
});
app.get('/api/separators', (_, res) =>
	getSettings({
		res,
		settingsType: settingsKeys.separators,
		settingsFileDir,
	}),
);
app.get('/api/ignoredChars', (_, res) =>
	getSettings({
		res,
		settingsType: settingsKeys.ignoredChars,
		settingsFileDir,
	}),
);
app.get('/api/logs', (_, res) =>
	fs.readFile(logsDir, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			res?.status(500).send('Ошибка чтения файла логов');
			return;
		}
		res?.send(data);
	}),
);
app.get('/api/tagsDir', (_, res) =>
	getSettings({ res, settingsType: settingsKeys.tagsDir, settingsFileDir }),
);
app.post('/api/separators/set/', (req, res) => {
	const dataReq = { ...req?.body };
	fs.readFile(settingsFileDir, 'utf8', (err, data) => {
		if (err) {
			res?.status(500).send('Ошибка чтения файла настроек');
			return;
		}
		const settings = JSON.parse(data);
		settings.separators = dataReq.value;
		fs.writeFile(settingsFileDir, JSON.stringify(settings), 'utf8', (err) => {
			if (err) {
				res?.status(501).send('Ошибка записи файла настроек');
				return;
			}
			res?.status(201).send(JSON.stringify(dataReq.value));
		});
	});
});
app.post('/api/ignoredChars/set/', (req, res) =>
	setSettings({
		req,
		res,
		settingsType: settingsKeys.ignoredChars,
		settingsFileDir,
	}),
);

app.post('/api/tagsDir/set/', (req, res) =>
	setSettings({ req, res, settingsType: settingsKeys.tagsDir, settingsFileDir }),
);

app.delete('/api/tagsDir/delete/', (req, res) =>
	deleteSettings({
		req,
		res,
		settingsType: settingsKeys.tagsDir,
		settingsFileDir,
	}),
);

app.delete('/api/separators/delete/', (req, res) => {
	const { id } = { ...req?.body };
	if (!id) return res?.status(400).json({ error: 'Нет ID для удаления' });
	fs.readFile(settingsFileDir, 'utf8', (err, data) => {
		if (err) {
			res?.status(500).send('Ошибка чтения файла настроек');
			return;
		}
		const settings = JSON.parse(data);
		settings.separators = '';
		fs.writeFile(settingsFileDir, JSON.stringify(settings), 'utf8', (err) => {
			if (err) {
				res?.status(501).send('Ошибка записи файла настроек');
				return;
			}
			res?.status(204).send();
		});
	});
});

app.delete('/api/ignoredChars/delete/', (req, res) =>
	deleteSettings({
		req,
		res,
		settingsType: settingsKeys.ignoredChars,
		settingsFileDir,
	}),
);

app.post('/api/settings/upload', (req, res) => {
	const data = { ...req.body };
	fs.writeFile(settingsFileDir, JSON.stringify(data), 'utf8', (err) => {
		if (err) {
			console.error('Ошибка записи файла:', err);
			return res.status(500).json({ error: 'Ошибка записи файла' });
		}
		res.status(201).send(JSON.stringify(data));
	});
});

app.get('/api/settings/download', (_, res) => {
	res.download(settingsFileDir, 'settings.json', (err) => {
		if (err) {
			console.error('Ошибка отправки файла:', err);
			res.status(500).json({ error: 'Ошибка отправки файла' });
		}
	});
});

server.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

// Грейсфул-шаутдаун
const FORCE_EXIT_TIMEOUT = 10000; // ms

const gracefulShutdown = async (reason: string) => {
	try {
		console.log(`Shutting down: ${reason}`);

		// 1) Остановить watcher (chokidar)
		try {
			await checkerFolder.stop();
			console.log('Watcher closed');
		} catch (err) {
			console.error('Error closing watcher:', err);
		}

		// 2) Закрыть socket.io (подождём callback)
		try {
			await new Promise<void>((resolve) => {
				io.close(() => {
					console.log('Socket.io closed');
					resolve();
				});
			});
		} catch (err) {
			console.error('Error closing socket.io:', err);
		}

		// 3) Закрыть HTTP сервер (ждём завершения всех соединений)
		try {
			await new Promise<void>((resolve, reject) => {
				server.close((err) => {
					if (err) {
						reject(err);
					} else {
						console.log('HTTP server closed');
						resolve();
					}
				});
			});
		} catch (err) {
			console.error('Error closing HTTP server:', err);
		}

		// Здесь можно добавить финализацию (сохранение очереди сообщений и т.п.)

		console.log('Shutdown complete');
		process.exit(0);
	} catch (err) {
		console.error('Fatal error during shutdown:', err);
		process.exit(1);
	}
};

// Фейковый таймаут на аварийный exit, если что-то зависло
const scheduleForceExit = () => {
	setTimeout(() => {
		console.error(`Forcing exit after ${FORCE_EXIT_TIMEOUT}ms`);
		process.exit(1);
	}, FORCE_EXIT_TIMEOUT).unref();
};

// Обработчики сигналов и ошибок
process.on('SIGINT', () => {
	scheduleForceExit();
	gracefulShutdown('SIGINT');
});
process.on('SIGTERM', () => {
	scheduleForceExit();
	gracefulShutdown('SIGTERM');
});
process.on('uncaughtException', (err) => {
	console.error('uncaughtException:', err);
	scheduleForceExit();
	gracefulShutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
	console.error('unhandledRejection:', reason);
	scheduleForceExit();
	gracefulShutdown('unhandledRejection');
});
