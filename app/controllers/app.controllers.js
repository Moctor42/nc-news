const { fetchTopics } = require('../models/app.models')

exports.getTopics = (request, response)=>{
    fetchTopics()
    .then((result)=>{
        response.status(200).send({topics: result})
    })
}