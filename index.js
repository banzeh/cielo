module.exports = (params) => {
  const cielo = require('./lib/cielo')(params)

  return {
    creditCard: {
      simpleTransaction: cielo.postSalesCielo,
      completeTransaction: cielo.postSalesCielo,
      authenticationTransaction: cielo.postSalesCielo,
      fraudAnalysisTransaction: cielo.postSalesCielo,
      cardTokenTransaction: cielo.postSalesCielo,
      captureSaleTransaction: cielo.captureSale,
      cancelSale: cielo.cancelSale
    },
    debitCard: {
      simpleTransaction: cielo.postSalesCielo
    },
    bankSlip: {
      simpleTransaction: cielo.postSalesCielo
    },
    boleto: {
      sale: cielo.postSalesCielo
    },
    recurrentPayments: {
      firstScheduledRecurrence: cielo.postSalesCielo,
      creditScheduledRecurrence: cielo.postSalesCielo,
      authorizing: cielo.postSalesCielo,
      modify: new Proxy({}, cielo.modifyingRecurrenceHandler),
      consulting: cielo.recurrenceConsulting
    },
    cards: {
      createTokenizedCard: cielo.createTokenizedCard,
      consultaTokenizedCard: cielo.consultaTokenizedCard
    },
    consulting: {
      sale: cielo.consultaCielo,
      storeIndetifier: cielo.consultaCielo,
      fraudAnalysis: cielo.consultaCielo,
      cardBin: cielo.cardBin
    }
  }
}
