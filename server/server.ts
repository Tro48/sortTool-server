import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import fs, { readFile, readFileSync } from 'fs'
import path from 'path'
dotenv.config()
const app = express()
const port = process.env.VITE_PORT
const foldersDir = process.env.FOLDERS_PATH
app.use(express.static('dist'))
app.use(cors())
app.use(express.json());

app.get('/api/folders', (req, res) => {
  const dirPath = path.join(foldersDir ? foldersDir : '')
  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) return res.status(500).json({ error: 'ошибка чтения' })
    const folders = files.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name)
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
app.post('/api/separators/set/', (req, res) => {
  const { separator } = req.body
  if (!separator) return res.status(400).json({ error: 'Нет данных для добавления' })
  const newSeparator = {
    id: Math.random(),
    value: separator,
  }
  try {
    const settings = JSON.parse(readFileSync('backend/db/baseSettings.json', {encoding: 'utf-8'})) 
    settings.separators.push(newSeparator);
    fs.writeFile('backend/db/baseSettings.json', JSON.stringify(settings), (err)=>{
      if (err) res.status(401).json({ error: 'Ошибка сохранения данных' })
    })
  } catch (error) {
    res.status(405).json({ error: 'Ошибка чтения данных из файла' })
  }
  fs.readFile('backend/db/baseSettings.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error reading base settings data')
      return
    }
    const jsonData = JSON.parse(data)
    console.log(jsonData)
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
