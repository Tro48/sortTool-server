import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { CheckerFiles } from '../scripts/checkerFiles';
import { delayedClear } from '../scripts/clearLog';
import { configPath, getDb, logsDir, settingsDir } from '../scripts/utils';
import { deleteSettings, getSettings, setSettings } from './methods';
// Эмуляция __dirname для ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath =
	typeof process.pkg !== 'undefined' ? path.join(__dirname, '../dist_bundled') : 'dist';
const serverIp = typeof process.pkg !== 'undefined' ? '0.0.0.0' : '';
let serverConfig = { PORT: 5050, API_URL: 'http://localhost:3000' };
if (fs.existsSync(configPath)) {
	try {
		serverConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
	} catch (error) {
		console.error('Ошибка чтения config.json, используем дефолты', error);
	}
}
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const checkerFolder = new CheckerFiles(io);
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
delayedClear(logsDir, THREE_DAYS_MS);
io.on('connection', (_socket) => {
	console.log('Фронтенд подключился');
});

const { settingsData } = getDb();

if (!settingsData.foldersDir || !settingsData.listenDir) {
	console.error('Не указаны деректория папок или листен директория');
	io.emit('errorFolderDir', 'Не указаны деректория папок или листен директория');
} else {
	checkerFolder.setNewDir(settingsData.listenDir);
	checkerFolder.start();
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
}

const settingsKeys = {
	separators: 'separators',
	ignoredChars: 'ignoredChars',
	tagsDir: 'tagsDir',
	logs: 'logs',
	foldersDir: 'foldersDir',
	listenDir: 'listenDir',
};

app.use(express.static(distPath));
app.use(cors());
app.use(express.json());

app.get('/api/settings/status', (_, res) => {
	const { settingsData } = getDb();
	if (!settingsData.foldersDir || !settingsData.listenDir) {
		return res.status(400).json({ state: false, error: 'Missing foldersDir or listenDir' });
	}
	res.json({
		state: true,
		settings: { foldersDir: settingsData.foldersDir, listenDir: settingsData.listenDir },
	});
});

app.post('/api/settings/setFoldersDir', (req, res) => {
	const { settingsData } = getDb();
	const settingsItem = { ...req?.body };
	if (!settingsItem) return res?.status(500).json({ error: 'Нет данных для добавления' });
	const newSettings = {
		...settingsData,
		foldersDir: settingsItem.foldersDir,
		listenDir: settingsItem.listenDir,
	};
	fs.writeFile(settingsDir, JSON.stringify(newSettings), 'utf8', (err) => {
		if (err) {
			res?.status(501).send('Ошибка записи файла настроек');
			return;
		}
		res?.status(201).send(JSON.stringify(newSettings));
	});
});

app.get('/api/folders', (_, res) => {
	const _settings = JSON.parse(fs.readFileSync(settingsDir, 'utf-8'));
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
		settingsDir,
	}),
);
app.get('/api/ignoredChars', (_, res) =>
	getSettings({
		res,
		settingsType: settingsKeys.ignoredChars,
		settingsDir,
	}),
);
app.get('/api/logs', (_, res) => {
	const data = fs.readFileSync(logsDir, 'utf8').trim();
	try {
		const json = JSON.parse(data);
		res.json(json);
	} catch (err) {
		console.error(err);
		res.send(data);
	}
});
app.get('/api/tagsDir', (_, res) =>
	getSettings({ res, settingsType: settingsKeys.tagsDir, settingsDir }),
);
app.post('/api/separators/set/', (req, res) => {
	const dataReq = { ...req?.body };
	fs.readFile(settingsDir, 'utf8', (err, data) => {
		if (err) {
			res?.status(500).send('Ошибка чтения файла настроек');
			return;
		}
		const settings = JSON.parse(data);
		settings.separators = dataReq.value;
		fs.writeFile(settingsDir, JSON.stringify(settings), 'utf8', (err) => {
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
		settingsDir,
	}),
);

app.post('/api/tagsDir/set/', (req, res) =>
	setSettings({ req, res, settingsType: settingsKeys.tagsDir, settingsDir }),
);

app.delete('/api/tagsDir/delete/', (req, res) =>
	deleteSettings({
		req,
		res,
		settingsType: settingsKeys.tagsDir,
		settingsDir,
	}),
);

app.delete('/api/separators/delete/', (req, res) => {
	const { id } = { ...req?.body };
	if (!id) return res?.status(400).json({ error: 'Нет ID для удаления' });
	fs.readFile(settingsDir, 'utf8', (err, data) => {
		if (err) {
			res?.status(500).send('Ошибка чтения файла настроек');
			return;
		}
		const settings = JSON.parse(data);
		settings.separators = '';
		fs.writeFile(settingsDir, JSON.stringify(settings), 'utf8', (err) => {
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
		settingsDir,
	}),
);

app.post('/api/settings/upload', (req, res) => {
	const data = { ...req.body };
	fs.writeFile(settingsDir, JSON.stringify(data), 'utf8', (err) => {
		if (err) {
			console.error('Ошибка записи файла:', err);
			return res.status(500).json({ error: 'Ошибка записи файла' });
		}
		res.status(201).send(JSON.stringify(data));
	});
});

app.get('/api/settings/download', (_, res) => {
	res.download(settingsDir, 'settings.json', (err) => {
		if (err) {
			console.error('Ошибка отправки файла:', err);
			res.status(500).json({ error: 'Ошибка отправки файла' });
		}
	});
});

server.listen(serverConfig.PORT, serverIp, () => {
	console.log(`Сервер запущен: ${serverConfig.API_URL}:${serverConfig.PORT}`);
	console.log(`Что бы закрыть приложение нажмите CTRL + C или закройте окно`);
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
