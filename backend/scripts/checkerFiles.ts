import chokidar, { FSWatcher } from 'chokidar';
import { DefaultEventsMap, Server } from 'socket.io';
import { copyFile } from './utils';

export class CheckerFiles {
	dir: string = '';
	checkerFolder: FSWatcher | undefined;
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
	messageStore: Map<string, { fileName: string; state: string; message: string }> = new Map();

	constructor(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>) {
		this.io = io;
	}
	setNewDir(dir: string) {
		if (this.checkerFolder) {
			this.checkerFolder.unwatch(this.dir);
			this.dir = dir;
			this.checkerFolder.add(this.dir);
		} else {
			this.dir = dir;
		}
	}
	start() {
		if (!this.dir) {
			console.error('dir not found');
			return;
		}
		this.checkerFolder = chokidar.watch(this.dir, {
			awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 },
		});
		this.checkerFolder
			.on('add', (filePath: string) => copyFile(filePath, this.io))
			.on('change', (filePath: string) =>
				setTimeout(() => {
					copyFile(filePath, this.io);
				}, 500),
			)
			.on('error', (err: unknown) => {
				if (err instanceof Error) console.error(err.message);
				else console.error(err);
			});
		setTimeout(() => {
			this.io.emit('scriptStart', 'Скрипт запущен');
		}, 3000);
	}
	async stop() {
		if (!this.checkerFolder) {
			console.error('Watcher not found');
			return;
		}
		this.checkerFolder.unwatch(this.dir);
		await this.checkerFolder.close();
		this.io.emit('scriptStop', 'Скрипт остановлен');
	}
}
