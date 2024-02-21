const { fetchArticleById, fetchArticles, fetchCommentsByArticleId, insertCommentByArticleId, updateArticleById } = require('../models/articles.model')

exports.getArticleById = (request, response, next)=>{
    const {article_id} = request.params
    fetchArticleById(article_id)
    .then((result)=>{
        response.status(200).send({article: result.rows[0]})
    })
    .catch((error)=>{
        next(error)
    })
}

exports.getArticles = (request, response, next)=>{
    fetchArticles()
    .then((result)=>{
        response.status(200).send({articles: result})
    })
    .catch((error)=>{
        next(error)
    })
}

exports.getCommentsByArticleId = (request, response, next)=>{
    const {article_id} = request.params
    fetchCommentsByArticleId(article_id)
    .then((result)=>{
        response.status(200).send({comments: result})
    })
    .catch((error)=>{
        next(error)
    })
}

exports.postCommentByArticleId = (request, response, next)=>{
    const {article_id} = request.params
    const {body, username} = request.body
    insertCommentByArticleId(article_id, body, username)
    .then((result)=>{
        response.status(201).send({comment: result})
    })
    .catch((error)=>{
        next(error)
    })
}

exports.patchArticleById = (request, response, next)=>{
    const {article_id} = request.params
    const {inc_votes} = request.body
    updateArticleById(article_id, inc_votes)
    .then((result)=>{
        response.status(200).send({article: result})
    })
    .catch((error)=>{
        next(error)
    })
}