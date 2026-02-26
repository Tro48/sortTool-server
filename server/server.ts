import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import path from 'path'
const __dirname =import.meta.dirname
const app = express()
const port = process.env.VITE_PORT
const foldersDir = process.env.FOLDERS_PATH
app.use(express.static('dist'))
app.use(cors())

app.get('/api/folders', (req, res) => {
  const dirPath = path.join( foldersDir ? foldersDir : '')
  fs.readdir(dirPath, {withFileTypes: true}, (err, files) => {
    if (err) return res.status(500).json({error: 'ошибка чтения'})
    const folders = files.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name)
    res.json(folders)
  })
})

app.get('/api/separators', (req, res) => {
  fs.readFile('backend/db/baseSettings.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error reading base settings data')
      return
    }
    const jsonData = JSON.parse(data)
    res.send(JSON.stringify(jsonData.separators))
  })
})

app.get('/api/ignoredChars', (req, res) => {
  fs.readFile('backend/db/baseSettings.json', 'utf8', (err, data) => {
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
  fs.readFile('backend/db/tagsDir.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error reading tags directory data')
      return
    }
    res.send(data)
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
