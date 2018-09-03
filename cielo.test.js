const _test = require('tape-promise').default
const tape = require('tape')
const test = _test(tape)
const paramsCielo = {
  'MerchantId': 'e60c1e21cf8743d1bc1fbd760fe0aba4',
  'MerchantKey': 'LVYLUTLJYYIXXRUQMXLIMYEDLRVCRWHNGYQFIVIG',
  'sandbox': true,
  'debug': false
}
const cielo = require('./cielo')(paramsCielo)
const regexToken = new RegExp(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/)
const brands = ['Visa', 'Master', 'Amex', 'Elo', 'Aura', 'JCB', 'Diners', 'Discover', 'Hipercard']

brands.forEach(brand => {
  test(brand, async (t) => {
    const tokenParams = {
      'CustomerName': 'Comprador Teste Cielo',
      'CardNumber': '4532117080573700',
      'Holder': 'Comprador T Cielo',
      'ExpirationDate': '12/2021',
      'Brand': brand
    }
    const token = await cielo.cards.createTokenizedCard(tokenParams)

    const vendaParams = {
      'MerchantOrderId': 'CieloNodeJS000003',
      'Customer': {
        'Name': 'Comprador Teste'
      },
      'Payment': {
        'Type': 'CreditCard',
        'Amount': 100,
        'Installments': 1,
        'SoftDescriptor': '123456789ABCD',
        'CreditCard': {
          'CardToken': token.CardToken,
          'SecurityCode': '262',
          'Brand': brand
        }
      }
    }
    const venda = await cielo.creditCard.simpleTransaction(vendaParams)

    const capturaParams = {
      paymentId: venda.Payment.PaymentId,
      amount: 70
    }
    const captura = await cielo.creditCard.captureSaleTransaction(capturaParams)

    const consultaParams = {
      paymentId: venda.Payment.PaymentId
    }
    const consultaPaymentId = await cielo.consulting.sale(consultaParams)

    const consultaParamsMerchantOrderId = {
      merchantOrderId: 'CieloNodeJS000003'
    }

    const consultaMerchantOrderId = await cielo.consulting.sale(consultaParamsMerchantOrderId)

    const cancelaVendaParams = {
      paymentId: venda.Payment.PaymentId
    }
    const cancelaVenda = await cielo.creditCard.cancelSale(cancelaVendaParams)

    t.assert('CardToken' in token, 'retorno cardToken correto')
    t.assert(regexToken.test(token.CardToken), 'CardToken válido')
    t.assert(venda.Payment.Status === 1, 'Status da Venda Correto')
    t.assert(regexToken.test(venda.Payment.PaymentId), 'venda.Payment.PaymentId válido')
    t.assert(consultaPaymentId.Payment.Status === 2 || consultaPaymentId.Payment.Status === 1, 'Consulta de venda correta')
    t.assert(consultaMerchantOrderId.Payments.filter(x => x.PaymentId === venda.Payment.PaymentId).length > 0, 'Consulta de MerchantOrderId correta')
    t.assert(venda.Payment.Tid === consultaPaymentId.Payment.Tid, 'Tid da Venda Correto')
    t.assert(venda.Payment.Amount === vendaParams.Payment.Amount, 'Valor da Transação de Venda correto')
    t.assert(captura.Status === 2, 'Status da Caputra correto')
    t.assert(consultaPaymentId.Payment.CapturedAmount === capturaParams.amount, 'Valor da captura parcial correto')
    t.assert(cancelaVenda.Status === 10, 'Status de cancelamento correto')

    t.end()
  })
})

test('cardBin', async (t) => {
  const cardBinParams = {
    cardBin: 402400
  }
  const cardBin = await cielo.consulting.cardBin(cardBinParams)

  t.assert(cardBin.Status === '00', 'Status do CardBin válido (cardBin)')
  t.assert(cardBin.Provider === 'VISA', 'Bandeira do CardBin correto (cardBin)')
  t.assert(cardBin.CardType === 'Multiplo', 'Tipo de cartão (cardBin)')
  t.assert(cardBin.ForeignCard === true, 'Cartão emitido no exterior (cardBin)')

  t.end()
})

test('Boleto', async (t) => {
  const boletoParams = {
    "MerchantOrderId": "20180531",
    "Customer": {
      "Name": "Comprador Teste Boleto",
      "Identity": "1234567890",
      "Address": {
        "Street": "Avenida Marechal Câmara",
        "Number": "160",
        "Complement": "Sala 934",
        "ZipCode": "22750012",
        "District": "Centro",
        "City": "Rio de Janeiro",
        "State": "RJ",
        "Country": "BRA"
      }
    },
    "Payment": {
      "Type": "Boleto",
      "Amount": 15700,
      "Provider": "Bradesco2",
      "Address": "Rua Teste",
      "BoletoNumber": "123",
      "Assignor": "Empresa Teste",
      "Demonstrative": "Desmonstrative Teste",
      "ExpirationDate": "5/1/2015",
      "Identification": "11884926754",
      "Instructions": "Aceitar somente até a data de vencimento, após essa data juros de 1% dia."
    }
  }
  const boleto = await cielo.boleto.sale(boletoParams)

  t.assert(typeof boleto.Code === 'undefined', 'Não ocorreu erro no boleto')
  t.assert(typeof boleto.Payment !== 'undefined', 'Boleto retornou Payment')
  t.assert(boleto.Payment.Url.trim() !== '', 'Retornou Url para o boleto')
})

test('Recurrency', async (t) => {
  const recurrencyParams = {
    "MerchantOrderId": "2014113245231706",
    "Customer": {
      "Name": "Comprador rec programada"
    },
    "Payment": {
      "Type": "CreditCard",
      "Amount": 1500,
      "Installments": 1,
      "SoftDescriptor": "123456789ABCD",
      "RecurrentPayment": {
        "AuthorizeNow": "true",
        "EndDate": "2019-12-01",
        "Interval": "SemiAnnual"
      },
      "CreditCard": {
        "CardNumber": "1234123412341231",
        "Holder": "Teste Holder",
        "ExpirationDate": "12/2030",
        "SecurityCode": "262",
        "SaveCard": "false",
        "Brand": "Visa"
      }
    }
  }

  const firstRecurrency = await cielo.recurrentPayments.firstScheduledRecurrence(recurrencyParams)

  const modifyRecurrencyParams = 
  {
    "recurrentPaymentId": firstRecurrency.Payment.RecurrentPayment.RecurrentPaymentId,
    "Interval": 1
  }

  modifyRecurrency = await cielo.recurrentPayments.modify.Interval(modifyRecurrencyParams)

  const deactivateRecurrencyParams = {
    "recurrentPaymentId": firstRecurrency.Payment.RecurrentPayment.RecurrentPaymentId
  }

  deactivateRecurrency = await cielo.recurrentPayments.modify.Deactivate(deactivateRecurrencyParams)

  t.assert(firstRecurrency.Payment.RecurrentPayment.ReasonCode == 0, 'Pagamento recorrente criado')
  t.assert(firstRecurrency.Payment.Status === 1, 'Status transacional autorizado (1)')
  t.assert(firstRecurrency.Payment.RecurrentPayment.Interval === 6, 'Intervalo de recorrência correto (6)')
  t.assert(modifyRecurrency.statusCode === 200, 'Intervalo da recorrência alterado com sucesso (1)')
  t.assert(deactivateRecurrency.statusCode === 200, 'Recorrência desativada')
  
})