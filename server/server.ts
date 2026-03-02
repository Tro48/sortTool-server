import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { deleteSettings, getSettings, setSettings } from './methods';
import { Checker } from '../backend/scripts/checkForNewFiles';
dotenv.config();
const app = express();
const port = process.env.VITE_PORT;
const settingsFileDir = 'backend/db/settings.json';
const logsDir = 'backend/db/logs.json';
const checkerFiles = new Checker();

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

app.get('/api/playScript', (_, res) => {
	try {
		checkerFiles.play();
		res.json({ message: 'Скрипт запущен...', success: true })
	} catch (error) {
		res.status(507).send(error);
	}
});

app.get('/api/stopScript', (_, res) => {
	try {
		const message = checkerFiles.stop();
		res.json({ message: 'Скрипт остановлен', success: true })
	} catch (error) {
		res.status(507).send(error);
	}
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
