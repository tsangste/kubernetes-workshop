const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs-extra')
const path = require('path')
const request = require('request')
const shortid = require('shortid')

const app = express()
const serviceId = shortid.generate()

const service2Url = process.env.SERVICE2_URL || 'http://service2/'

const database = path.join(__dirname, '..', '..', 'database')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/test', (req, res) => {
  res.status(200).send('Hello!')
})

app.get('/test2', (req, res) => {
  request({
    url: service2Url,
    method: 'GET',
    json: true
  }, (err, response, body) => {
    if (err) return res.status(500).send(err)

    res.status(200).send(`Hello, ${body}`)
  })
})

app.get('/test3', (req, res) => {
  res.status(200).send(`Hello, I am service ${serviceId}`)
})

app.get('/test4/:id', (req, res) => {
  const id = req.params.id
  const item = path.join(database, `${id}.json`)

  fs.access(item, fs.F_OK, (err) => {
    if (err) return res.status(404).send(`id: ${id} not found`)

    fs.readFile(item, (err, data) => {
      if (err) return res.status(500).send(err)

      res.status(200).send(JSON.parse(data.toString()))
    })
  })
})

app.post('/test4', (req, res) => {
  const id = shortid.generate()

  fs.ensureDir(database, err => {
    if (err) return res.status(500).send(err)

    fs.writeFile(path.join(database, `${id}.json`), JSON.stringify(req.body), 'utf8', (err) => {
      if (err) return res.status(500).send(err)

      res.status(201).send(id)
    })
  })
})

app.get('/test5', (req, res) => {
  const responseFile = path.join(__dirname, 'res.json')

  fs.readFile(responseFile, (err, data) => {
    if (err) return res.status(500).send(err)

    res.status(200).send(JSON.parse(data.toString()))
  })
})


app.listen(80, () => console.log('app running on port.', 80))
