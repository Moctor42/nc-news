const express = require('express')
const app = express()
const endpoints = require('../endpoints.json')
// controllers
const { getTopics, getApi } = require('./controllers/app.controllers')
const { getArticleById, getArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleById } = require('./controllers/articles.controller')
const { deleteCommentById } = require('./controllers/comments.controller')

const { error404, error400, psqlError, errorCatcher } = require('./error_handling')

app.use(express.json())

app.get('/api', getApi)

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.patch('/api/articles/:article_id', patchArticleById)

app.delete('/api/comments/:comment_id', deleteCommentById)



// error handling

app.use(error404)

app.use(error400)

app.use(psqlError)


// catches any rogue errors and console logs em
app.use(errorCatcher)

module.exports = app