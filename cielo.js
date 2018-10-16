const util = require('util')

module.exports = (params) => {
  const library = require('./library')(params)
  const get = library.get
  const getHostname = library.getHostname

  const postSalesCielo = (data) => {
    const o = {
      hostname: getHostname('requisicao'),
      path: '/1/sales',
      method: 'POST'
    }
    return get(o, data)
  }

  const captureSale = (data) => {
    var o = {
      hostname: getHostname('requisicao'),
      path: util.format('/1/sales/%s/capture?amount=%s', data.paymentId, data.amount),
      method: 'PUT'
    }

    if (data.serviceTaxAmount) {
      o.path += util.format('/serviceTaxAmount=%s', data.serviceTaxAmount)
    }

    return get(o, data)
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
      o.path = util.format('/1/sales/%s/void', data.paymentId)
    } else {
      o.path = util.format('/1/sales/OrderId/%s/void', data.merchantOrderId)
    }

    // Se o valor do cancelamento for informado, concatena na url
    if (data.amount > 0){
      o.path += util.format('?amount=%s', data.amount)
    }

    return get(o, data)
  }

  const createTokenizedCard = (data) => {
    const o = {
      hostname: getHostname('requisicao'),
      path: '/1/card',
      method: 'POST'
    }
    return get(o, data)
  }

  const consultaCielo = (data) => {
    const o = {
      hostname: getHostname('consulta'),
      path: (typeof data.paymentId !== 'undefined') ? util.format('/1/sales/%s', data.paymentId) : util.format('/1/sales?merchantOrderId=%s', data.merchantOrderId),
      method: 'GET'
    }
    return get(o, data)
  }

  const cardBin = (data) => {
    const o = {
      hostname: getHostname('consulta'),
      path: util.format('/1/cardBin/%s', data.cardBin),
      method: 'GET'
    }
    return get(o, data)
  }

  const modifyingRecurrenceHandler = {
    get(target, name) {
      return function (data) {
        var o = {
          hostname: getHostname('requisicao'),
          method: 'PUT',
          path: util.format('/1/RecurrentPayment/%s/%s', data.recurrentPaymentId, name)
        }
        return get(o, data[name] || {})
      }
    }
  }

  const recurrenceConsulting = (data) => {
    const o = {
      hostname: getHostname('consulta'),
      path: util.format('/1/RecurrentPayment/%s', data.recurrentPaymentId),
      method: 'GET'
    }
    return get(o, data)
  }

  return {
    postSalesCielo: postSalesCielo,
    cancelSale: cancelSale,
    captureSale: captureSale,
    modifyingRecurrenceHandler: modifyingRecurrenceHandler,
    recurrenceConsulting: recurrenceConsulting,
    createTokenizedCard: createTokenizedCard,
    consultaCielo: consultaCielo,
    cardBin: cardBin
  }
}