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
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows})=>{
        if (!rows.length) {
            return Promise.reject({status: 404, msg: 'article not found'})
        }
        else {
            return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id])
            .then(({rows})=>{
                return rows
            })
        }
    })
}

exports.insertCommentByArticleId = (article_id, body, username)=>{

    return db.query(`INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3) RETURNING *;`,[article_id, username, body])
    .then(({rows})=>{
        return rows[0]
    })
}

exports.updateArticleById = (article_id, inc_votes)=>{
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
    .then(({rows})=>{
        if (!rows.length) {
            return Promise.reject({status: 404, msg: 'article not found'})
        }
        return rows[0]
    })
}