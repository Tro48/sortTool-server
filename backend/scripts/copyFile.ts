import fs from 'fs';
import { calculateNewDir } from './calculateNewDir';

// export class GetCopyFileParam {
// 	oldDir;
// 	newDir;
// 	file;
// 	dirDefault;
// 	searchResult;
// 	messageResult;
// 	settings;
// 	optionsDate = {
// 		lang: 'ru-RU',
// 		options: {
// 			hour: 'numeric',
// 			minute: 'numeric',
// 			second: 'numeric',
// 			timeZoneName: 'short',
// 		},
// 	};
// 	#calc = (settings, file) => {
// 		const fileInfo = {
// 			searchResult: false,
// 		};
// 		const fileNameArr = file
// 			.replace(/[.()\-— ,]/g, '_')
// 			.toUpperCase()
// 			.split('_');
// 		const arrTag = fileNameArr.filter((item) => {
// 			return settings.listTag.indexOf(item) >= 0;
// 		});
// 		let tag;
// 		if (arrTag.length === 1) {
// 			tag = arrTag.join('');
// 			fileInfo.searchResult = tag;
// 			fileInfo.newDir = settings.dirList[tag] + file.replaceAll(' ', '_');
// 			return fileInfo;
// 		} else if (arrTag.length > 1) {
// 			if (settings.dirList[arrTag.join('_')]) {
// 				tag = arrTag.join('_');
// 				fileInfo.searchResult = tag;
// 				fileInfo.newDir = settings.dirList[tag] + file.replaceAll(' ', '_');
// 				return fileInfo;
// 			} else {
// 				tag = arrTag.reverse().join('_');
// 				fileInfo.searchResult = tag;
// 				fileInfo.newDir = settings.dirList[tag] + file.replaceAll(' ', '_');
// 				return fileInfo;
// 			}
// 		} else {
// 			fileInfo.searchResult = false;
// 			fileInfo.newDir = false;
// 			return fileInfo;
// 		}
// 	};

// 	constructor(file, settings) {
// 		this.settings = settings;
// 		this.oldDir = settings.folderPath + file;
// 		this.newDir = this.#calc(settings, file).newDir;
// 		this.file = file;
// 		this.dirDefault = settings.dirDefault;
// 		this.searchResult = this.#calc(settings, file).searchResult;
// 		this.messageResult = {
// 			copyFileOk: `Файл ${this.file} перемещён в ${this.newDir} `,
// 			copyFileOther: `Файл ${this.file} перемещён в дефолтную папку ${this.dirDefault}. Проверьте имя файла или создайте нужную папку. `,
// 			copyFileDefaultFolder: `НЕТ СОВПАДЕНИЙ! Файл ${this.file} перемещён в дефолтную папку ${this.dirDefault}. `,
// 			copyFileError: `Ожидание файла ${this.file} ... `,
// 			noDirdefault: `Нет папки для неизвестных файлов. ${this.file} удалён! `,
// 		};
// 	}
// }

export async function copyFile(path: string) {
	const newFileDir = calculateNewDir(path);
	if (newFileDir) {
		console.log('fileDir its ok');
		try {
			fs.copyFile(path, newFileDir, (err) => {
				if (err) {
					console.error(err);
					return;
				}
				console.log(`copy ${path} from ${newFileDir}`);
				fs.unlink(path, (err) => {
					if (err) {
						console.error(err);
						return;
					}
					console.log(`delete ${path}`);
				});
			});
		} catch (err) {
			// console.log('ожидание...')
			// console.error(err);
		}
	}
}
