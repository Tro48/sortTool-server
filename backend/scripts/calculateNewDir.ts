import { type SettingsFileData } from '../../src/stores/useSettingsStore';
import settingsFile from '../db/settings.json';

export const calculateNewDir = (dir: string): string => {
  let newDir = '';
	try {
		const settings: SettingsFileData = settingsFile;
		const fileName = dir.split('/').slice(-1)[0];
            console.log(fileName)
		const separator = settings.separators.map((item) => item.value)[0];
		const tags = Object.keys(settings.tagsDir);
		if (!fileName) return '';
		const fileNameArr = fileName
			.replace(/[.()\-— ,]/g, separator)
			.toUpperCase()
			.split(separator);
		const arrTag = fileNameArr.filter((item) => tags.indexOf(item) >= 0);
		let tag;
		if (arrTag.length === 1) {
			tag = arrTag.join('');
			newDir = (
				settings.foldersDir + settings.tagsDir[tag] + '//' + fileName.replaceAll(' ', '_')
			);
		} else if (arrTag.length > 1) {
			if (settings.tagsDir[arrTag.join('_')]) {
				tag = arrTag.join('_');
				newDir = (
					settings.foldersDir +
					settings.tagsDir[tag] +
					'//' +
					fileName.replaceAll(' ', '_')
				);
			} else {
				tag = arrTag.reverse().join('_');
				newDir = (
					settings.foldersDir +
					settings.tagsDir[tag] +
					'//' +
					fileName.replaceAll(' ', '_')
				);
			}
		} else {
			newDir = '';
		}
	} catch (error) {
		console.error(error);
	}
  return newDir;
};
