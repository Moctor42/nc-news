const { fetchTopics } = require('../models/topics.model')
const endpointList = require('../../endpoints.json')

exports.getApi = (request, response)=>{
    response.status(200).send({endpoints: endpointList})
}


exports.getTopics = (request, response)=>{
    fetchTopics()
    .then((result)=>{
        response.status(200).send({topics: result})
    })
}
