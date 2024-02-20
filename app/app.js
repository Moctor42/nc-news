const express = require('express')
const app = express()
const { getTopics, getApi } = require('./controllers/app.controllers')
const endpoints = require('../endpoints.json')

app.get('/api', getApi)

app.get('/api/topics', getTopics)

module.exports = app