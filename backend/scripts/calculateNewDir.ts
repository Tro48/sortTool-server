import { type SettingsFileData } from '../../src/stores/useSettingsStore';
import settingsFile from '../db/settings.json';

export const calculateNewDir = (dir: string): string => {
	const settings: SettingsFileData = settingsFile;
	const fileName = dir.split('\\').slice(-1)[0];
	const separators = settings.separators.map((item) => item.value);
	const tags = Object.keys(settings.tagsDir);
	if (!fileName) return '';
	const fileNameArr = fileName
		.replace(/[.()\-— ,]/g, '_')
		.toUpperCase()
		.split(`_`);
	const arrTag = fileNameArr.filter((item) => tags.indexOf(item) >= 0);
	let tag;
	if (arrTag.length === 1) {
		tag = arrTag.join('');
		return settings.foldersDir + settings.tagsDir[tag] + '//' + fileName.replaceAll(' ', '_');
	} else if (arrTag.length > 1) {
		if (settings.tagsDir[arrTag.join('_')]) {
			tag = arrTag.join('_');
			return settings.foldersDir + settings.tagsDir[tag]  + '//' + fileName.replaceAll(' ', '_');
		} else {
			tag = arrTag.reverse().join('_');
			return settings.foldersDir + settings.tagsDir[tag]  + '//' + fileName.replaceAll(' ', '_');
		}
	} else {
		return '';
	}
};
