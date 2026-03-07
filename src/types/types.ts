export interface SettingsFileData {
  foldersDir: string;
  ignoredChars: { id: string; value: string }[];
  separators: string;
  tagsDir: Record<string, string>;
  listenDir: string;
}


export interface ILogItem {
	fileName: string;
	state: 'pending' | 'pass' | 'error';
	message: string;
}

export interface UseLogs {
	logsList: Map<string, ILogItem>;
}
