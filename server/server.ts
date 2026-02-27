import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import fs from 'fs'
import path from 'path'
import { setSettings } from './methods.ts'
dotenv.config()
const app = express()
const port = process.env.VITE_PORT
const foldersDir = process.env.FOLDERS_PATH
const settingsFileDir = 'backend/db/settings.json'
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

app.get('/api/folders', (req, res) => {
  const dirPath = path.join(foldersDir ? foldersDir : '')
  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).json({ error: 'ошибка чтения' })
    const folders = files.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name)
    res.json(folders)
  })
})

app.get('/api/separators', (req, res) => {
  fs.readFile(settingsFileDir, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Ошибка чтения файла настроек')
      return
    }
    const jsonData = JSON.parse(data)
    res.send(JSON.stringify(jsonData.separators))
  })
})
app.post('/api/separators/set/', (req, res) => setSettings(req, res, 'separators', settingsFileDir))

app.get('/api/ignoredChars', (req, res) => {
  fs.readFile(settingsFileDir, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error reading base settings data')
      return
    }
    const jsonData = JSON.parse(data)
    res.send(JSON.stringify(jsonData.ignoredChars))
  })
})

app.get('/api/logs', (req, res) => {
  fs.readFile('backend/db/logs.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error reading logs data')
      return
    }
    res.send(data)
  })
})

app.get('/api/tagsDir', (req, res) => {
  fs.readFile(settingsFileDir, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error reading tags directory data')
      return
    }
    const settings = JSON.parse(data)
    res.send(settings.tagsDir)
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
