const db = require('../../db/connection')

exports.fetchArticleById = (article_id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({rows})=>{
        if (rows.length === 0) return Promise.reject({status: 404, msg: 'article not found'})
        return rows[0]
    })
}

exports.fetchArticles = ()=>{
    const articlePromise = db.query(`SELECT article_id, title, topic, author, created_at, votes FROM articles ORDER BY created_at;`)
    const commentPromise = db.query(`SELECT article_id FROM comments`)
    return Promise.all([articlePromise, commentPromise])
    .then(([articles, comments])=>{
        articles.rows.forEach((article)=>{
            article.comment_count = comments.rows.filter((comment)=> comment.article_id === article.article_id).length
        })

        return articles
    })
}







