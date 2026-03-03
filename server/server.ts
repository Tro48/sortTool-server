import chokidar from 'chokidar';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import settings from '../backend/db/settings.json';
import { copyFile } from '../backend/scripts/copyFile';
import { deleteSettings, getSettings, setSettings } from './methods';
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const port = process.env.VITE_PORT;
const settingsFileDir = 'backend/db/settings.json';
const logsDir = 'backend/db/logs.json';
const checkerFolder = chokidar.watch(settings.listenDir, {
	awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 },
});

// fs.writeFile(logsDir, JSON.stringify({}), 'utf8', (err) => {
// 	if (err) {
// 		console.error(err);
// 	}
// });

const getFileName = (dir: string) => dir.split('\\').slice(-1)[0];

const messageStore = new Map();

const sendLog = (message: string, state: 'pending' | 'pass' | 'error', fileName: string) => {
	const date = new Date();
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
};

try {
	checkerFolder
		.on('add', (filePath: string) =>
			copyFile(filePath, sendLog, getFileName(filePath), messageStore),
		)
		.on('change', (filePath: string) =>
			setTimeout(() => {
				copyFile(filePath, sendLog, getFileName(filePath), messageStore);
			}, 500),
		)
		.on('error', (err: unknown) => {
			if (err instanceof Error) console.error(err.message);
			else console.error(err);
		});
} catch (error) {
	console.error('Ошибка при отслеживании папки:', error);
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
app.post('/api/separators/set/', (req, res) =>
	setSettings({
		req,
		res,
		settingsType: settingsKeys.separators,
		settingsFileDir,
	}),
);
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

app.delete('/api/separators/delete/', (req, res) =>
	deleteSettings({
		req,
		res,
		settingsType: settingsKeys.separators,
		settingsFileDir,
	}),
);

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
