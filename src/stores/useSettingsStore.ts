import { defineStore } from 'pinia'
const apiUrl = `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_PORT}/api/`

export const useSettings = defineStore('settingsStore', {
  state: (): {
    ignoredChars: { id: string; value: string }[]
    pendingChars: boolean
    separators: { id: string; value: string }[]
    pendingSep: boolean
    tagsDir: { [key: string]: string }
    pendingTagsDir: boolean
    folders: string[]
    pendingFolders: boolean
  } => ({
    ignoredChars: [],
    pendingChars: false,
    separators: [],
    pendingSep: false,
    tagsDir: {},
    pendingTagsDir: false,
    folders: [],
    pendingFolders: false,
  }),
  actions: {
    async fetchIgnoredChars() {
      this.pendingChars = true
      try {
        const response = await fetch(apiUrl + 'ignoredChars')
        this.ignoredChars = await response.json()
      } catch (error) {
        console.error('chars fetch error', error)
      } finally {
        this.pendingChars = false
      }
    },
    async fetchSeparators() {
      this.pendingSep = true
      try {
        const response = await fetch(apiUrl + 'separators')
        const data = await response.json()
        this.separators = [...data]
      } catch (error) {
        console.error('Ошибка:', error)
      } finally {
        this.pendingSep = false
      }
    },
    async fetchSetSeparator(sepData: string) {
      this.pendingSep = true
      try {
        const response = await fetch(apiUrl + 'separators/set/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: sepData }),
        })
        const data = await response.json()
        this.separators.push(data)
      } catch (error) {
        console.error('Ошибка:', error)
      } finally {
        this.pendingSep = false
      }
    },
    async fetchAllTagsDir() {
      this.pendingTagsDir = true
      try {
        const response = await fetch(apiUrl + 'tagsDir')
        const data = await response.json()
        this.tagsDir = data
      } catch (error) {
        console.error('Ошибка:', error)
      } finally {
        this.pendingTagsDir = false
      }
    },
    async fetchAllFolders() {
      this.pendingFolders = true
      try {
        this.folders = await (await fetch(apiUrl + 'folders')).json()
      } catch (error) {
        console.error('Ошибка:', error)
      } finally {
        this.pendingFolders = false
      }
    },
  },
  getters: {
    getFolders: (state) =>
      (state.folders ?? []).map((item: string) => ({ label: item, value: item })),
    getTagsDir: (state) => Object.entries(state.tagsDir),
    getTagsNames: (state) => Object.keys(state.tagsDir),
  },
})

// export const useSeparatorsStore = defineStore('separators', {
//   state: (): {
//     separators: { id: string; value: string }[]
//     pending: boolean
//   } => ({
//     separators: [],
//     pending: false,
//   }),
//   actions: {
//     async fetchSeparators() {
//       this.pending = true
//       try {
//         const response = await fetch(apiUrl + 'separators')
//         const data = await response.json()
//         this.separators = [...data]
//       } catch (error) {
//         console.error('Ошибка:', error)
//       } finally {
//         this.pending = false
//       }
//     },
//     async fetchSetSeparator(sepData: string) {
//       this.pending = true
//       try {
//         const response = await fetch(apiUrl + 'separators/set/', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ value: sepData }),
//         })
//         const data = await response.json()
//         this.separators.push(data)
//       } catch (error) {
//         console.error('Ошибка:', error)
//       } finally {
//         this.pending = false
//       }
//     },
//   },
// })

// export const useFoldersStore = defineStore('folders', {
//   state: () => ({
//     folders: [],
//     pending: false,
//   }),
//   actions: {
//     async fetchAllFolders() {
//       this.pending = true
//       this.folders = await (await fetch(apiUrl + 'folders')).json()
//       this.pending = false
//     },
//   },
//   getters: {
//     getFolders: (state) =>
//       (state.folders ?? []).map((item: string) => ({ label: item, value: item })),
//   },
// })

// export const useTagsDirStore = defineStore('tagsDir', {
//   state: () => ({
//     tagsDir: {},
//     pending: false,
//   }),
//   actions: {
//     async fetchAllTagsDir() {
//       this.pending = true
//       fetch(apiUrl + 'tagsDir')
//         .then((res) => res.json())
//         .then((data) => {
//           this.tagsDir = data
//           this.pending = false
//         })
//         .finally(() => (this.pending = false))
//     },
//   },
//   getters: {
//     getTagsDir: (state) => Object.entries(state.tagsDir),
//     getTagsNames: (state) => Object.keys(state.tagsDir),
//   },
// })
