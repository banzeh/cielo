const https = require('https')
var log = {}
var controller = {}
var sandbox = false

exports = module.exports = (params) => {
  sandbox = params.sandbox
  log = require('./log')(params).log

  return controller
}

function requestError(err) {
  const errorMessage = {
    msg: 'Erro na requisicao para a Cielo',
    request: optionsData,
    data: dataPost,
    erro: err
  }
  log('erro no request ', errorMessage)
  return errorMessage
}

// Realiza um request https
controller.get = function (optionsData, data) {
  return new Promise((resolve, reject) => {
    const dataPost = JSON.stringify(data)
    optionsData.headers['Content-Length'] = Buffer.byteLength(dataPost)
    var req = https.request(optionsData, (res) => {
      var chunks = []

      res.on('data', function (chunk) {
        chunks.push(chunk)
      })

      res.on('end', function () {
        var body = Buffer.concat(chunks)
        var response = ''
        if ([200, 201].indexOf(res.statusCode) === -1) return reject(`Ocorre um erro ao fazer a requisição. StatusCode: ${res.statusCode}.`)
        if (optionsData.method === 'PUT' && chunks.length === 0) return resolve({statusCode: res.statusCode})
        response = (chunks.length > 0) ? JSON.parse(body) : ''
        log('res.on(end)', response)
        return resolve(response)
      })
    })

    req.write(dataPost)
    req.on('error', (err) => reject(requestError))
    req.end()
  })
}