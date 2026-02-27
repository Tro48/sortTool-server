import fs from 'fs';
import crypto from 'crypto';

export const setSettings = (req, res, key, settingsFileDir) => {
	const settingsItem = { ...req.body };
	if (!settingsItem)
		return res.status(500).json({ error: 'Нет данных для добавления' });
	const newSettingsItem = {
		id: crypto.randomBytes(16).toString('hex'),
		...settingsItem,
	};
	fs.readFile(settingsFileDir, 'utf8', (err, data) => {
		if (err) {
			res.status(500).send('Ошибка чтения файла настроек');
			return;
		}
		const settings = JSON.parse(data);
		settings[key].push(newSettingsItem);
		fs.writeFile(
			settingsFileDir,
			JSON.stringify(settings),
			'utf8',
			(err) => {
				if (err) {
					res.status(501).send('Ошибка записи файла настроек');
					return;
				}
				res.status(201).send(JSON.stringify(newSettingsItem));
			},
		);
	});
};

export const getSettings = (res, key, settingsFileDir) => {
	fs.readFile(settingsFileDir, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).send('Ошибка чтения файла настроек');
			return;
		}
		const settings = JSON.parse(data);
		res.send(JSON.stringify(settings[key]));
	});
};
