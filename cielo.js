var controller = {}
var get
var getHostname

module.exports = (params) => {
  const library = require('./library')(params)
  get = library.get
  getHostname = library.getHostname

  return controller
}

controller.postSalesCielo = (data) => {
  const o = {
    hostname: getHostname('requisicao'),
    path: '/1/sales',
    method: 'POST'
  }
  return get(o, data)
}

controller.captureSale = (data) => {
  var o = {
    hostname: getHostname('requisicao'),
    path: `/1/sales/${data.paymentId}/capture?amount=${data.amount}`,
    method: 'PUT'
  }

  if (data.serviceTaxAmount) {
    o.path += `/serviceTaxAmount=${data.serviceTaxAmount}`
  }

  return get(o, data)
}

/**
 * Cancela a venda - Dá preferencia para cancelar pelo paymentId, se não existir, utiliza o OrderId
 * @param {object} data
 * @param {callback} callback
 */
controller.cancelSale = (data) => {
  var o = {
    hostname: getHostname('requisicao'),
    method: 'PUT'
  }

  if (data.paymentId) {
    o.path = `/1/sales/${data.paymentId}/void`
  } else {
    o.path = `/1/sales/OrderId/${data.merchantOrderId}/void`
  }

  // Se o valor do cancelamento for informado, concatena na url
  if (data.amount > 0){
    o.path += `?amount=${data.amount}`
  }

  return get(o, data)
}

controller.createTokenizedCard = (data) => {
  const o = {
    hostname: getHostname('requisicao'),
    path: '/1/card',
    method: 'POST'
  }
  return get(o, data)
}

controller.consultaCielo = (data) => {
  const o = {
    hostname: getHostname('consulta'),
    path: (typeof data.paymentId !== 'undefined') ? `/1/sales/${data.paymentId}` : `/1/sales?merchantOrderId=${data.merchantOrderId}`,
    method: 'GET'
  }
  return get(o, data)
}

controller.cardBin = function cardbin (data) {
  const o = {
    hostname: getHostname('consulta'),
    path: `/1/cardBin/${data.cardBin}`,
    method: 'GET'
  }
  return get(o, data)
}

controller.modifyingRecurrenceHandler = {
  get(target, name) {
    return function (data) {
      var o = {
        hostname: getHostname('requisicao'),
        method: 'PUT',
        path: `/1/RecurrentPayment/${data.recurrentPaymentId}/${name}`
      }
      return get(o, data[name] || {})
    }
  }
}

controller.recurrenceConsulting = (data) => {
  const o = {
    hostname: getHostname('consulta'),
    path: `/1/RecurrentPayment/${data.recurrentPaymentId}`,
    method: 'GET'
  }
  return get(o, data)
}
