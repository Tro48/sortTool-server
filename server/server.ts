import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { deleteSettings, getSettings, setSettings } from './methods.ts';
dotenv.config();
const app = express();
const port = process.env.VITE_PORT;
const foldersDir = process.env.FOLDERS_PATH;
const settingsFileDir = 'backend/db/settings.json';
const logsDir = 'backend/db/logs.json';

const settingsKeys = {
	separators: 'separators',
	ignoredChars: 'ignoredChars',
	tagsDir: 'tagsDir',
	logs: 'logs',
};

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

app.get('/api/folders', (req, res) => {
	const dirPath = path.join(foldersDir ? foldersDir : '');
	fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
		if (err) return res.status(500).json({ error: 'ошибка чтения' });
		const folders = files.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
		res.json(folders);
	});
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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
