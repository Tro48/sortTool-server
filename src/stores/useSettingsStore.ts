import { defineStore } from 'pinia'

export const useIgnoredCharsStore = defineStore('ignoredChars', {
  state: () => ({
    ignoredChars: [],
    loader: false
  }),
  actions: {
    async fetchIgnoredChars() {
      this.loader = true
      const response = await fetch('http://localhost:5050/ignoredChars')
      this.ignoredChars = await response.json()
      this.loader = false
    },
  },
})

export const useSeparatorsStore = defineStore('separators', {
  state: () => ({
    separators: [],
    loader: false
  }),
  actions: {
    async fetchSeparators() {
      this.loader = true
      const response = await fetch('http://localhost:5050/separators')
      this.separators = await response.json()
      this.loader = false
    },
  },
})
