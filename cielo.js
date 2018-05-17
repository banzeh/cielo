const https = require('https')
const util = require('util')

module.exports = (params) => {
  const debug = params.debug || false

  /**
   * Caso o flag debug for true, retorna o log no console
   */
  const log = function () {
    if (debug) {
      console.log('------------ DEBUG ------------\n', new Date(), '\n\n', arguments, '\n\n------------ END DEBUG ------------\n')
    }
  }

  const options = {
    port: 443,
    secureProtocol: 'TLSv1_method',
    encoding: 'utf-8',
    headers: {
      'Content-Type': 'application/json',
      'MerchantId': params.MerchantId,
      'MerchantKey': params.MerchantKey,
      'RequestId': params.RequestId || ''
    }
  }

  function getHostname (type) {
    switch (type) {
      case 'requisicao':
        if (params.sandbox) {
          return 'apisandbox.cieloecommerce.cielo.com.br'
        } else {
          return 'api.cieloecommerce.cielo.com.br'
        }
      case 'consulta':
        if (params.sandbox) {
          return 'apiquerysandbox.cieloecommerce.cielo.com.br'
        } else {
          return 'apiquery.cieloecommerce.cielo.com.br'
        }
      default:
        return 'ERROR - HOSTNAME OPTIONS INVÁLIDO'
    }
  }

  const r = function (requestOptions, data) {
    return new Promise((resolve, reject) => {
      var opt = Object.assign(options, requestOptions)
      const d = JSON.stringify(data)
      opt.headers['Content-Length'] = Buffer.byteLength(d)
      var req = https.request(opt, (res) => {
        log('request options data', opt, data)
        var chunks = []

        res.on('data', function (chunk) {
          chunks.push(chunk)
        })

        res.on('end', function () {
          var body = Buffer.concat(chunks)
          var r = ''
          try {
            r = JSON.parse(body)
            log('retorno cielo', r)
          } catch (err) {
            return reject(err)
          }
          log('res.on(end)', r)
          return resolve(r)
        })
      })
      req.write(d)
      req.on('error', (err) => {
        log('erro no request ', err)
        return reject(err)
      })
      req.end()
    })
  }

  const postSalesCielo = (data) => {
    const o = {
      hostname: getHostname('requisicao'),
      path: '/1/sales',
      method: 'POST'
    }
    return r(o, data)
  }

  const captureSale = (data) => {
    var o = {
      hostname: getHostname('requisicao'),
      path: util.format('/1/sales/%s/capture?amount=%s', data.paymentId, data.amount)
    }

    if (data.serviceTaxAmount) {
      o.path += util.format('/serviceTaxAmount=%s', data.serviceTaxAmount)
    }

    options.method = 'PUT'
    return r(o, data)
  }

  /**
   * Cancela a venda - Dá preferencia para cancelar pelo paymentId, se não existir, utiliza o OrderId
   * @param {object} data
   * @param {callback} callback
   */
  const cancelSale = (data) => {
    var o = {
      hostname: getHostname('requisicao'),
      method: 'PUT'
    }

    if (data.paymentId) {
      o.path = util.format('/1/sales/%s/void?amount=%s', data.paymentId, data.amount)
    } else {
      o.path = util.format('/1/sales/OrderId/%s/void?amount=%s', data.merchantOrderId, data.amount)
    }

    return r(o, data)
  }

  const modifyingRecurrence = (data) => {
    const o = {
      hostname: getHostname('requisicao'),
      path: util.format('/1/RecurrentPayment/%s/%s', data.recurrentPaymentId, data.type),
      method: 'PUT'
    }
    return r(o, data)
  }

  const createTokenizedCard = (data) => {
    const o = {
      hostname: getHostname('requisicao'),
      path: '/1/card',
      method: 'POST'
    }
    return r(o, data)
  }

  const consultaCielo = (data) => {
    const o = {
      hostname: getHostname('consulta'),
      path: (typeof data.paymentId !== 'undefined') ? util.format('/1/sales/%s', data.paymentId) : util.format('/1/sales?merchantOrderId=%s', data.merchantOrderId),
      method: 'GET'
    }
    return r(o, data)
  }

  return {
    creditCard: {
      simpleTransaction: postSalesCielo,
      completeTransaction: postSalesCielo,
      authenticationTransaction: postSalesCielo,
      fraudAnalysisTransaction: postSalesCielo,
      cardTokenTransaction: postSalesCielo,
      captureSaleTransaction: captureSale,
      cancelSale: cancelSale
    },
    debitCard: {
      simpleTransaction: postSalesCielo
    },
    bankSlip: {
      simpleTransaction: postSalesCielo
    },
    boleto: {
      sale: postSalesCielo
    },
    recurrentPayments: {
      firstScheduledRecurrence: postSalesCielo,
      creditScheduledRecurrence: postSalesCielo,
      authorizing: postSalesCielo,
      modifyBuyerData: modifyingRecurrence
    },
    cards: {
      createTokenizedCard: createTokenizedCard
    },
    consulting: {
      sale: consultaCielo,
      storeIndetifier: consultaCielo,
      fraudAnalysis: consultaCielo
    }
  }
}
