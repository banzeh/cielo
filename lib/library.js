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
    statusCode: err.statusCode,
    msg: err.msg,
    request: err.request
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
        var response = (chunks.length > 0) ? JSON.parse(body) : '';
        if ([200, 201].indexOf(res.statusCode) === -1) return reject(requestError({ statusCode: res.statusCode, request: JSON.stringify(options), msg: response }));
        if (options.method === 'PUT' && chunks.length === 0) return resolve({statusCode: res.statusCode})
        log('res.on(end)', response)
        return resolve(response)
      })
    })

    req.write(data)
    req.on('error', (err) => reject(requestError({ statusCode: 0, request: options, msg: JSON.stringify(err) })))
    req.end()
  })
}

// Realiza um request https
controller.get = function (optionsData, data) {
  const dataPost = JSON.stringify(data).normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  optionsData.headers['Content-Length'] = Buffer.byteLength(dataPost)
  return httpsRequest(optionsData, dataPost)
}