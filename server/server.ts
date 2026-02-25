import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
import express from 'express'
import fs from 'fs'
const app = express()
const port = process.env.VITE_PORT
app.use(express.static('dist'))
app.use(cors())

app.get('/folders', (req, res) => {
  fs.readFile('backend/db/folders.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error reading folders data')
      return
    }
    res.send(data)
  })
})

app.get('/separators', (req, res) => {
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

app.get('/ignoredChars', (req, res) => {
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

app.get('/logs', (req, res) => {
  fs.readFile('backend/db/logs.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      res.status(500).send('Error reading logs data')
      return
    }
    res.send(data)
  })
})

app.get('/tagsDir', (req, res) => {
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
