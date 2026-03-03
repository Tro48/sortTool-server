import { defineStore } from 'pinia';
const apiUrl = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_PORT}/api/`;

interface ILogItem {
	fileName: string;
	state: 'pending' | 'pass' | 'error';
	message: string;
}

interface UseLogs {
	logsList: Map<string, ILogItem>;
}

export const useLogs = defineStore('logs', {
	state: (): UseLogs => ({
        logsList: new Map()
    }),
    actions: {
        async fetchGetAllLogs(){
            try {
                const response = await fetch(apiUrl + 'logs')
                const data: { [key: string]: ILogItem } = await response.json();
                Object.entries(data).forEach(([key, value]) => {
                    this.logsList.set(key, value);
                })

            } catch (error) {
                console.error(error)
            }
        },
        setLogItem(log:ILogItem){
            this.logsList.set(log.fileName, log)
        }
    },
});
