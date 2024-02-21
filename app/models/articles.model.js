const db = require('../../db/connection')

exports.fetchArticleById = (article_id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result)=>{
        if (result.rows.length === 0) return Promise.reject({status: 404, msg: 'article not found'})
        return result
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

exports.fetchCommentsByArticleId = (article_id)=>{
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id])
    .then((result)=>{
        if(result.rows.length === 0) return Promise.reject({status: 404, msg: 'article not found'})
        return result
    })
}

exports.insertCommentByArticleId = (article_id, body, username)=>{

    return db.query(`INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3) RETURNING *;`,[article_id, username, body])
    .then(({rows})=>{
        return rows[0]
    })
}
