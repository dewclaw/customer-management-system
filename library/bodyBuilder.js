const queryString = require('querystring')

function buildBody(request,timeout) {
    return new Promise((resolve,reject)=>{
        try {
            let promiseTimeout = setTimeout(()=>{
                reject('Bodying Parsing Timed Out')
            }, timeout)
            let body = ''
            request.on('data', data => {
                body += data
            })
            request.on('end', ()=>{
                clearTimeout(promiseTimeout)
                resolve(queryString.parse(body))
                // resolve(body)
            })
        } catch (error) {
            reject(`major body parsing error ||||||| ${util.inspect(error)}`)
        }
    })
}
module.exports = {
    buildBody : buildBody
}