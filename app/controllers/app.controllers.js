const { fetchTopics, fetchEndpoints } = require('../models/app.models')

exports.getApi = (request, response)=>{
    fetchEndpoints()
    .then((result)=>{
        response.status(200).send({endpoints: result})
    })
    
}

exports.getTopics = (request, response)=>{
    fetchTopics()
    .then((result)=>{
        response.status(200).send({topics: result})
    })
}