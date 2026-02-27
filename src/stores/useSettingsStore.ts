import { defineStore } from 'pinia'
const apiUrl = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_PORT}/api/`

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
    async fetchSetSeparator(sepData: string) {
      this.loader = true
      await fetch(apiUrl + 'separators/set/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: sepData }),
      })
        .then((res) => res.json())
        .then((data) => (this.separators = data))
        .catch((error) => console.error('Ошибка:', error))
        .finally(() => (this.loader = false))
        this.fetchSeparators()
    },
  },
})

export const useFoldersStore = defineStore('folders', {
  state: () => ({
    folders: [],
    loader: false,
  }),
  actions: {
    async fetchAllFolders() {
      this.loader = true
      this.folders = await (await fetch(apiUrl + 'folders')).json()
      this.loader = false
    },
  },
  getters: {
    getFolders: (state) =>
      (state.folders ?? []).map((item: string) => ({ label: item, value: item })),
  },
})

export const useTagsDirStore = defineStore('tagsDir', {
  state: () => ({
    tagsDir: {},
    loader: false,
  }),
  actions: {
    async fetchAllTagsDir() {
      this.loader = true
      fetch(apiUrl + 'tagsDir')
        .then((res) => res.json())
        .then((data) => {
          this.tagsDir = data
          this.loader = false
        })
        .finally(() => (this.loader = false))
    },
  },
  getters: {
    getTagsDir: (state) => Object.entries(state.tagsDir),
    getTagsNames: (state) => Object.keys(state.tagsDir),
  },
})
