const express = require("express")
const bodyParser = require("body-parser")
const fs = require('fs')
const path = require('path')
const request = require("request")

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/test", (req, res) => {
  res.status(200).send("Hello!")
})

app.get("/test2", (req, res) => {
  request({
    url: 'http://service2/',
    method: 'GET',
    json: true
  }, (err, response, body) => {
    if (err) return res.status(500).send(err)

    res.status(200).send(`Hello, ${body}`)
  })
})

app.get("/test3", (req, res) => {
  const responseFile = path.join(__dirname, 'res.json')

  fs.readFile(responseFile, (err, data) => {
    if (err) return res.status(500).send(err)

    res.status(200).send(JSON.parse(data.toString()))
  })
})

app.listen(80, () => console.log("app running on port.", 80))
