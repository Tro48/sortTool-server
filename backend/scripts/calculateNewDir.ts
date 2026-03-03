import { type SettingsFileData } from '../../src/stores/useSettingsStore';
import settingsFile from '../db/settings.json';

export const calculateNewDir = (dir: string): string => {
	let newDir = '';
	try {
		const settings: SettingsFileData = settingsFile;
		const fileName = dir.split('\\').slice(-1)[0];
		const separator = settings.separators.map((item) => item.value)[0];
		const tags = Object.keys(settings.tagsDir);
		if (!fileName) return '';
		const fileNameArr = fileName
			.replace(/[.()\-— ,]/g, separator)
			.toUpperCase()
			.split(separator);
		const arrTag = fileNameArr.filter(part => 
			tags.some(key => key.split(separator).includes(part))
		  );
		let tag;
		if (arrTag.length === 1) {
			tag = arrTag[0];
			newDir =
				settings.foldersDir + settings.tagsDir[tag] + '\\' + fileName.replaceAll(' ', separator);
		} else if (arrTag.length > 1) {
			tag = arrTag.join(separator);
			if (settings.tagsDir[tag]) {
				newDir =
					settings.foldersDir +
					settings.tagsDir[tag] +
					'\\' +
					fileName.replaceAll(' ', separator);
			} else {
				tag = arrTag.reverse().join(separator);
				console.log(tag)
				newDir =
					settings.foldersDir +
					settings.tagsDir[tag] +
					'\\' +
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
