const { fetchTopics } = require('../models/app.models')
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
