const util = require('util')

function Cielo(params) {
  this.params = params
  this.library = require('./library')(params)
}

Cielo.prototype.postSalesCielo = function(data) {
  const o = {
    hostname: this.library.getHostname('requisicao'),
    path: '/1/sales',
    method: 'POST'
  }
  return this.library.get(o, data)
}

Cielo.prototype.captureSale = function(data) {
  var o = {
    hostname: this.library.getHostname('requisicao'),
    path: util.format('/1/sales/%s/capture?amount=%s', data.paymentId, data.amount),
    method: 'PUT'
  }

  if (data.serviceTaxAmount) {
    o.path += util.format('/serviceTaxAmount=%s', data.serviceTaxAmount)
  }

  return this.library.get(o, data)
}

/**
 * Cancela a venda - Dá preferencia para cancelar pelo paymentId, se não existir, utiliza o OrderId
 * @param {object} data
 * @param {callback} callback
 */
Cielo.prototype.cancelSale = function(data) {
  var o = {
    hostname: this.library.getHostname('requisicao'),
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

  return this.library.get(o, data)
}

Cielo.prototype.createTokenizedCard = function(data) {
  const o = {
    hostname: this.library.getHostname('requisicao'),
    path: '/1/card',
    method: 'POST'
  }
  return this.library.get(o, data)
}

Cielo.prototype.consultaCielo = function(data) {
  const o = {
    hostname: this.library.getHostname('consulta'),
    path: (typeof data.paymentId !== 'undefined') ? util.format('/1/sales/%s', data.paymentId) : util.format('/1/sales?merchantOrderId=%s', data.merchantOrderId),
    method: 'GET'
  }
  return this.library.get(o, data)
}

Cielo.prototype.cardBin = function(data) {
  console.log('this', this)
  const o = {
    hostname: this.library.getHostname('consulta'),
    path: util.format('/1/cardBin/%s', data.cardBin),
    method: 'GET'
  }
  return this.library.get(o, data)
}

Cielo.prototype.modifyingRecurrenceHandler = {
  get(target, name) {
    return function(data) {
      var o = {
        hostname: this.library.getHostname('requisicao'),
        method: 'PUT',
        path: util.format('/1/RecurrentPayment/%s/%s', data.recurrentPaymentId, name)
      }
      return this.library.get(o, data[name] || {})
    }
  }
}

Cielo.prototype.recurrenceConsulting, Cielo.prototype.teste = function(data) {
  const o = {
    hostname: this.library.getHostname('consulta'),
    path: util.format('/1/RecurrentPayment/%s', data.recurrentPaymentId),
    method: 'GET'
  }
  return this.library.get(o, data)
}

exports = module.exports = Cielo