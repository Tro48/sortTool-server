import chokidar from 'chokidar';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import settings from '../backend/db/settings.json';
import { copyFile } from '../backend/scripts/copyFile';
import { deleteSettings, getSettings, setSettings } from './methods';
import { Server } from "socket.io";
import http from 'http';
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

try {
	checkerFolder
		.on('add', (filePath: string) =>
			setTimeout(() => {
				copyFile(filePath);
			}, 500),
		)
		.on('change', (filePath: string) =>
			setTimeout(() => {
				copyFile(filePath);
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

const sendLog = (message:string) => {
    const logEntry = { time: new Date().toLocaleTimeString(), message };
    console.log(logEntry); // В консоль сервера
    io.emit('log', logEntry); // Отправка на фронт
};

io.on('connection', (_socket) => {
    console.log('Фронтенд подключился');
    sendLog('Клиент подключился к сокету');
});

app.get('/api/folders', (_, res) => {
	const _settings = JSON.parse(fs.readFileSync(settingsFileDir, 'utf-8'));
	if (!_settings.foldersDir) {
		return res.status(500).json({ error: 'Путь к папкам не задан' });
	} else {
		const dirPath = path.join(_settings.foldersDir ? _settings.foldersDir : '');
		fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
			if (err) return res.status(500).json({ error: 'ошибка чтения' });
			const folders = files
				.filter((dirent) => dirent.isDirectory())
				.map((dirent) => dirent.name);
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
	getSettings({
		res,
		settingsType: settingsKeys.logs,
		settingsFileDir: logsDir,
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
