import os from 'os';
import { type SettingsFileData } from '../../src/stores/useSettingsStore';
import settingsFile from '../db/settings.json';

const platform = os.platform();

export const calculateNewDir = (dir: string): string => {
	const separatorDir = platform === 'win32' ? '\\' : '/';
	let newDir = '';
	try {
		const settings: SettingsFileData = settingsFile;
		const fileName = dir.split(separatorDir).slice(-1)[0];
		if (fileName === '.DS_Store') return '';
		const separator = settings.separators;
		const tags = Object.keys(settings.tagsDir);
		if (!fileName) return '';
		const fileNameArr = fileName
			.replace(/[.()\-— ,]/g, separator)
			.toUpperCase()
			.split(separator);
		const arrTag = fileNameArr.filter((part) =>
			tags.some((key) => key.split(separator).includes(part)),
		);
		let tag;
		if (arrTag.length === 1) {
			tag = arrTag[0];
			newDir =
				settings.foldersDir +
				settings.tagsDir[tag] +
				separatorDir +
				fileName.replaceAll(' ', separator);
		} else if (arrTag.length > 1) {
			tag = arrTag.join(separator);
			if (settings.tagsDir[tag]) {
				newDir =
					settings.foldersDir +
					settings.tagsDir[tag] +
					separatorDir +
					fileName.replaceAll(' ', separator);
			} else {
				tag = arrTag.reverse().join(separator);
				console.log(tag);
				newDir =
					settings.foldersDir +
					settings.tagsDir[tag] +
					separatorDir +
					fileName.replaceAll(' ', separator);
			}
		} else {
			newDir = '';
		}
	} catch (error) {
		console.error(error);
	}
	return newDir;
};
