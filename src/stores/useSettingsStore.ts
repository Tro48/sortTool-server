import { defineStore } from 'pinia'
const apiUrl = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_PORT}/`;

export const useIgnoredCharsStore = defineStore('ignoredChars', {
  state: () => ({
    ignoredChars: [],
    loader: false,
  }),
  actions: {
    async fetchIgnoredChars() {
      this.loader = true
      const response = await fetch(apiUrl + 'ignoredChars')
      this.ignoredChars = await response.json()
      this.loader = false
    },
  },
})

export const useSeparatorsStore = defineStore('separators', {
  state: () => ({
    separators: [],
    loader: false,
  }),
  actions: {
    async fetchSeparators() {
      this.loader = true
      const response = await fetch(apiUrl + 'separators')
      this.separators = await response.json()
      this.loader = false
    },
  },
})

export const useFoldersStore = defineStore('folders', {
  state: () => ({
    folders: [],
    loader: false
  }),
  actions: {
    async fetchAllFolders () {
      this.loader = true;
      const response = await fetch(apiUrl + 'folders');
      this.folders = await response.json();
      this.loader = false;
    }
  }
})
