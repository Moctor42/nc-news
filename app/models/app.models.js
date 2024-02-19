const db = require('../../db/connection')
const fs = require('fs/promises')

exports.fetchEndpoints = ()=>{
    return fs.readFile('./endpoints.json', 'utf8')
    .then((fileData)=>{
        return JSON.parse(fileData)
    })
}

exports.fetchTopics = ()=>{
    return db.query(`SELECT * FROM topics`)
}