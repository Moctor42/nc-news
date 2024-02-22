const db = require('../../db/connection')

exports.fetchArticleById = (article_id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({rows})=>{
        if (rows.length === 0) return Promise.reject({status: 404, msg: 'article not found'})
        return rows[0]
    })
}

exports.fetchArticles = (query)=>{
    const {topic} = query
    const queryValues = []
    
    return db.query(`SELECT slug FROM topics WHERE slug = $1;`, [topic])
    .then(({rows})=>{
        if(!topic) return
        if(!rows.length) {
            return Promise.reject({status: 404, msg: 'topic not found'})
        }
    })
    .then(()=>{
        

        let queryStr = `
        SELECT 
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        COUNT(comments.article_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id `

        
        //queries
        

        if(topic) {
            queryValues.push(topic)
            queryStr += `WHERE articles.topic = $1 `
        }

        queryStr += `
        GROUP BY articles.article_id
        ORDER BY created_at;
        `

        return db.query(queryStr, queryValues)
    })
    .then(({rows})=>{
        return rows
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