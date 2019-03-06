const https = require('https')
var log = {}
var controller = {}
var sandbox

exports = module.exports = (params) => {
  sandbox = params.sandbox || false
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

function httpsRequest(options, data) {
  return new Promise((resolve, reject) => {
    var req = https.request(options, (res) => {
      var chunks = []

      res.on('data', function (chunk) {
        chunks.push(chunk)
      })

      res.on('end', function () {
        var body = Buffer.concat(chunks)
        var response = ''
        if ([200, 201].indexOf(res.statusCode) === -1) return reject(`Ocorre um erro ao fazer a requisição. StatusCode: ${res.statusCode}.`)
        if (options.method === 'PUT' && chunks.length === 0) return resolve({statusCode: res.statusCode})
        response = (chunks.length > 0) ? JSON.parse(body) : ''
        log('res.on(end)', response)
        return resolve(response)
      })
    })

    req.write(data)
    req.on('error', (err) => reject(requestError))
    req.end()
  })
}

// Realiza um request https
controller.get = function (optionsData, data) {
  const dataPost = JSON.stringify(data)
  optionsData.headers['Content-Length'] = Buffer.byteLength(dataPost)
  return httpsRequest(optionsData, dataPost)
}