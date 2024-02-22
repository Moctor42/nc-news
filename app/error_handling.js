exports.error404 = (error, request, response, next)=>{
    if (error.status === 404) {
        response.status(404).send(error)
    } else {
        next(error)
    }
}

exports.error400 = (error, request, response, next)=>{
    if (error.status === 400) {
        response.status(400).send(error)
    } else {
        next(error)
    }
}

exports.psqlError = (error, request, response, next)=>{
    if (error.code === '22P02') {
        response.status(400).send({msg: 'bad request', error: error})
    } else if (error.code === '23503'){
        const regex = /\w*(?=s")/g
        let msgString = error.detail.match(regex)[0] + ' not found'
        response.status(404).send({msg: msgString})
    } else if (error.code === '23502'){
        response.status(400).send({msg: 'missing property'})
    } else {
        next(error)
    }
}

exports.errorCatcher = (error, request, response, next)=>{
    console.log(error);
    response.status(500).send(error)

}