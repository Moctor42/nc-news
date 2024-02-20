const express = require('express')
const app = express()
const endpoints = require('../endpoints.json')
// controllers
const { getTopics, getApi } = require('./controllers/app.controllers')
const { getArticleById, getArticles } = require('./controllers/articles.controller')
const { error404, error400, psqlError, errorCatcher } = require('./error_handling')

app.get('/api', getApi)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)



// error handling

app.use(error404)

app.use(error400)

app.use(psqlError)


// catches any rogue errors and console logs em
app.use(errorCatcher)

module.exports = app