import chokidar, { FSWatcher } from 'chokidar';
import settings from '../db/settings.json';
import { copyFile } from './copyFile';

interface ICheckerFiles {
	checkerFolderDir: string;
	watcher: FSWatcher;
}

export class Checker implements ICheckerFiles {
	checkerFolderDir = settings.listenDir;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	watcher;

	// 	#copyFileInit(path:string) {
	// 	const fileName = path.split('\\').slice(-1)[0];
	// 	const rootName = path.split('\\').slice(-2)[0];
	// 	const copyFileParam = new GetCopyFileParam(fileName, this.settingsApp[rootName]);
	// 	setTimeout(() => {
	// 		copyFile(copyFileParam, param);
	// 	}, 500);
	// }

	play() {
		this.watcher = chokidar.watch(this.checkerFolderDir, {
			awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 },
		});
		try {
			this.watcher
				.on('add', (filePath: string) =>
					setTimeout(() => {
						copyFile(filePath);
					}, 500),
				)
				.on('change', (filePath: string) =>
					setTimeout(() => {
						copyFile(filePath);
					}, 500),
				)
				.on('error', (error: string) => console.error(error));
		} catch (error) {
			console.error(error);
		}
	}
	async stop() {
		await this.watcher.unwatch(this.checkerFolderDir);
		await this.watcher.close();
	}
}

// export class CheckForNewFiles implements CheckerFiles {
// 	settingsFileDir;
// 	settings;
// 	rootFoldersPath;
// 	watcherFolder;
// 	constructor(settingsFileDir:string) {
// 		this.settingsFileDir = settingsFileDir;
// 		this.settings = JSON.parse(fs.readFileSync(settingsFileDir, 'utf8'));
// 	}
// 	#setRootFoldersPath() {
// 		this.rootFoldersPath = [];
// 		const settingKeys = Object.keys(this.settingsApp);
// 		if (settingKeys.length) {
// 			settingKeys.forEach((key) => {
// 				this.rootFoldersPath.push(this.settingsApp[key].folderPath);
// 			});
// 		} else {
// 			console.log('Добавьте папку для отслеживания');
// 		}
// 	}
// 	#copyFileInit(path, param) {
// 		const fileName = path.split('\\').slice(-1)[0];
// 		const rootName = path.split('\\').slice(-2)[0];
// 		const copyFileParam = new GetCopyFileParam(fileName, this.settingsApp[rootName]);
// 		param.addLogMessage(
// 			{ message: frontConfig.dot, error: false },
// 			param.messageColor.notification,
// 		);
// 		setTimeout(() => {
// 			copyFile(copyFileParam, param);
// 		}, 500);
// 	}
// 	#stopError(param, error) {
// 		console.log(error, 'ошибка соединения');
// 		param.addLogMessage(
// 			{
// 				message: 'Потеря соединения с сервером! Нажмите кнопку запуска программы',
// 				error: true,
// 			},
// 			param.messageColor.error,
// 		);
// 	}
// 	watchPlay(param) {
// 		this.#setRootFoldersPath();
// 		this.watcherFolder = chokidar.watch(this.rootFoldersPath);
// 		try {
// 			this.watcherFolder
// 				.on('add', (path) => this.#copyFileInit(path, param))
// 				.on('change', (path) => this.#copyFileInit(path, param))
// 				.on('error', (error) => this.#stopError(param, error));
// 		} catch (error) {
// 			this.#stopError(param, error);
// 		}
// 	}
// 	async watchStop() {
// 		await this.watcherFolder.unwatch(this.rootFoldersPath);
// 		await this.watcherFolder.close();
// 	}
// }
