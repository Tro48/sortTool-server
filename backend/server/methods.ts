import crypto from 'crypto';
import { Request, Response } from 'express';
import fs from 'fs';

interface BaseProps {
	req?: Request;
	res?: Response;
	settingsType: string;
	settingsDir: string;
}

export const setSettings = ({ req, res, settingsType, settingsDir }: BaseProps) => {
	const settingsItem = { ...req?.body };
	if (!settingsItem) return res?.status(500).json({ error: 'Нет данных для добавления' });
	let newSettingsItem: Record<string, unknown> = {};
	let _keysSettingsItem: string[] = [];
	if (settingsType === 'tagsDir') {
		_keysSettingsItem = Object.keys(settingsItem);
	} else {
		newSettingsItem = {
			id: crypto.randomBytes(16).toString('hex'),
			...settingsItem,
		};
	}

	fs.readFile(settingsDir, 'utf8', (err, data) => {
		if (err) {
			res?.status(500).send('Ошибка чтения файла настроек');
			return;
		}
		const settings = JSON.parse(data);
		if (settingsType === 'tagsDir') {
			_keysSettingsItem.filter((key) => {
				let exist = true;
				Object.keys(settings.tagsDir).forEach((existKey) => {
					if (existKey === key) exist = false;
				});
				return exist;
			});
			_keysSettingsItem.forEach((key) => {
				settings.tagsDir[key] = settingsItem[key];
				newSettingsItem[key] = settingsItem[key];
			});
		} else {
			settings[settingsType].push(newSettingsItem);
		}
		fs.writeFile(settingsDir, JSON.stringify(settings), 'utf8', (err) => {
			if (err) {
				res?.status(501).send('Ошибка записи файла настроек');
				return;
			}
			res?.status(201).send(JSON.stringify(newSettingsItem));
		});
	});
};

export const getSettings = ({ res, settingsType, settingsDir }: BaseProps) => {
	fs.readFile(settingsDir, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			res?.status(500).send('Ошибка чтения файла настроек');
			return;
		}
		const settings = JSON.parse(data);
		res?.send(JSON.stringify(settings[settingsType]));
	});
};

export const deleteSettings = ({ req, res, settingsType, settingsDir }: BaseProps) => {
	const { id } = { ...req?.body };
	if (!id) return res?.status(400).json({ error: 'Нет ID для удаления' });
	fs.readFile(settingsDir, 'utf8', (err, data) => {
		if (err) {
			res?.status(500).send('Ошибка чтения файла настроек');
			return;
		}
		const settings = JSON.parse(data);
		if (settingsType === 'tagsDir') {
			if (!settings[settingsType][id]) {
				res?.status(404).json({ error: 'Тег не найден' });
				return;
			}
			delete settings[settingsType][id];
		} else {
			if (!settings[settingsType].find((item: Record<string, string>) => item.id === id)) {
				res?.status(404).json({ error: 'Тег не найден' });
				return;
			}
			settings[settingsType] = settings[settingsType].filter((item: Record<string, string>) => item.id !== id);
		}
		fs.writeFile(settingsDir, JSON.stringify(settings), 'utf8', (err) => {
			if (err) {
				res?.status(501).send('Ошибка записи файла настроек');
				return;
			}
			res?.status(204).send();
		});
	});
};
