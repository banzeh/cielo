var controller = {}
var get
var requestOptions
var URL_REQUISICAO
var URL_CONSULTA

module.exports = (params) => {
  const library = require('./library')(params)
  get = library.get
  requestOptions = {
    port: 443,
    encoding: 'utf-8',
    headers: {
      'MerchantId': params.MerchantId,
      'MerchantKey': params.MerchantKey,
      'RequestId': params.RequestId || '',
      'Content-Type': 'application/json'
    }
  }

  URL_REQUISICAO = (params.sandbox) ? 'apisandbox.cieloecommerce.cielo.com.br' : 'api.cieloecommerce.cielo.com.br'
  URL_CONSULTA = (params.sandbox) ? 'apiquerysandbox.cieloecommerce.cielo.com.br' : 'apiquery.cieloecommerce.cielo.com.br'

  return controller
}

controller.postSalesCielo = (data) => {
  const o = {
    hostname: URL_REQUISICAO,
    path: '/1/sales',
    method: 'POST'
  }
  return get(Object.assign(requestOptions, o), data)
}

controller.captureSale = (data) => {
  var o = {
    hostname: URL_REQUISICAO,
    path: `/1/sales/${data.paymentId}/capture?amount=${data.amount}`,
    method: 'PUT'
  }

  if (data.serviceTaxAmount) {
    o.path += `/serviceTaxAmount=${data.serviceTaxAmount}`
  }

  return get(Object.assign(requestOptions, o), data)
}

/**
 * Cancela a venda - Dá preferencia para cancelar pelo paymentId, se não existir, utiliza o OrderId
 * @param {object} data
 * @param {callback} callback
 */
controller.cancelSale = (data) => {
  var o = {
    hostname: URL_REQUISICAO,
    method: 'PUT'
  }

  if (data.paymentId) {
    o.path = `/1/sales/${data.paymentId}/void`
  } else {
    o.path = `/1/sales/OrderId/${data.merchantOrderId}/void`
  }

  // Se o valor do cancelamento for informado, concatena na url
  if (data.amount > 0) {
    o.path += `?amount=${data.amount}`
  }

  return get(Object.assign(requestOptions, o), data)
}

controller.createTokenizedCard = (data) => {
  const o = {
    hostname: URL_REQUISICAO,
    path: '/1/card',
    method: 'POST'
  }
  return get(Object.assign(requestOptions, o), data)
}

controller.consultaCielo = (data) => {
  const o = {
    hostname: URL_CONSULTA,
    path: (typeof data.paymentId !== 'undefined') ? `/1/sales/${data.paymentId}` : `/1/sales?merchantOrderId=${data.merchantOrderId}`,
    method: 'GET'
  }
  return get(Object.assign(requestOptions, o), data)
}

controller.cardBin = function cardbin (data) {
  const o = {
    hostname: URL_CONSULTA,
    path: `/1/cardBin/${data.cardBin}`,
    method: 'GET'
  }
  return get(Object.assign(requestOptions, o), data)
}

controller.modifyingRecurrenceHandler = {
  get (target, name) {
    return function (data) {
      var o = {
        hostname: URL_REQUISICAO,
        method: 'PUT',
        path: `/1/RecurrentPayment/${data.recurrentPaymentId}/${name}`
      }
      return get(Object.assign(requestOptions, o), data[name] || {})
    }
  }
}

controller.recurrenceConsulting = (data) => {
  const o = {
    hostname: URL_CONSULTA,
    path: `/1/RecurrentPayment/${data.recurrentPaymentId}`,
    method: 'GET'
  }
  return get(Object.assign(requestOptions, o), data)
}
