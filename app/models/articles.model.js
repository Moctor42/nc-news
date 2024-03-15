const db = require('../../db/connection')

exports.fetchArticleById = (article_id)=>{
    return db.query(`
    SELECT 
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.body,
    articles.votes,
    COUNT(comments.article_id)::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    ;`, 
    [article_id])
    .then(({rows})=>{
        if (rows.length === 0) return Promise.reject({status: 404, msg: 'article not found'})
        return rows[0]
    })
}

exports.fetchArticles = (query)=>{
    let {topic, sort_by, order} = query

    //defaults

    if(!sort_by){
        sort_by = 'created_at'
    }

    if(!order){
        order = 'asc'
    }

    //greenlist
    const queryValues = []
    const sortByGreenlist = [
        'article_id',
        'title',
        'topic',
        'author',
        'created_at',
        'votes',
        'comment_count'
    ]

    const orderGreenlist = [
        'asc',
        'desc'
    ]


    if(!sortByGreenlist.includes(sort_by)){
        return Promise.reject({status: 400, msg: `${sort_by} is not a valid sort query`})
    }
    if(!orderGreenlist.includes(order)){
        return Promise.reject({status: 400, msg: `${order} is not a valid order query`})
    }
    
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
        COUNT(comments.article_id)::INT AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id `

        
        //queries
        

        if(topic) {
            queryValues.push(topic)
            queryStr += `WHERE articles.topic = $1 `
        }

        queryStr += `GROUP BY articles.article_id `
        


        queryStr += `ORDER BY ${sort_by} ${order};`

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