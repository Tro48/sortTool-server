import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { setSettings, getSettings } from './methods.ts';
dotenv.config();
const app = express();
const port = process.env.VITE_PORT;
const foldersDir = process.env.FOLDERS_PATH;
const settingsFileDir = 'backend/db/settings.json';
const logsDir = 'backend/db/logs.json';
app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

app.get('/api/folders', (req, res) => {
	const dirPath = path.join(foldersDir ? foldersDir : '');
	fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
		if (err) return res.status(500).json({ error: 'ошибка чтения' });
		const folders = files
			.filter((dirent) => dirent.isDirectory())
			.map((dirent) => dirent.name);
		res.json(folders);
	});
});
app.get('/api/separators', (_, res) =>
	getSettings(res, 'separators', settingsFileDir),
);
app.get('/api/ignoredChars', (_, res) =>
	getSettings(res, 'ignoredChars', settingsFileDir),
);
app.get('/api/logs', (_, res) => getSettings(res, 'logs', logsDir));
app.get('/api/tagsDir', (_, res) =>
	getSettings(res, 'tagsDir', settingsFileDir),
);
app.post('/api/separators/set/', (req, res) =>
	setSettings(req, res, 'separators', settingsFileDir),
);
app.post('/api/ignoredChars/set/', (req, res) =>
	setSettings(req, res, 'ignoredChars', settingsFileDir),
);

app.post('/api/tagsDir/set/', (req, res) => {
	const settingsItem = { ...req.body };
	if (!settingsItem)
		return res.status(500).json({ error: 'Нет данных для добавления' });
	const keys = Object.keys(settingsItem);
	fs.readFile(settingsFileDir, 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Ошибка чтения файла настроек');
			return;
		}
		const settings = JSON.parse(data);
		const newItems = {};
		keys.filter((key) => {
			let exist = true;
			Object.keys(settings.tagsDir).forEach((existKey) => {
				if (existKey === key) exist = false;
			});
			return exist;
		});
		keys.forEach((key) => {
			settings.tagsDir[key] = settingsItem[key];
			newItems[key] = settingsItem[key];
		});
		fs.writeFile(
			settingsFileDir,
			JSON.stringify(settings),
			'utf8',
			(err) => {
				if (err) {
					res.status(501).send('Ошибка записи файла настроек');
					return;
				}
				res.status(201).send(JSON.stringify(newItems));
			},
		);
	});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
