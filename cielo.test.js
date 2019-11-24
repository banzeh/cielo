const _test = require('tape-promise').default
const tape = require('tape')
const test = _test(tape)
const paramsCielo = {
  'MerchantId': 'e60c1e21cf8743d1bc1fbd760fe0aba4',
  'MerchantKey': 'LVYLUTLJYYIXXRUQMXLIMYEDLRVCRWHNGYQFIVIG',
  'sandbox': true,
  'debug': false
}
const cielo = require('./index')(paramsCielo)
const regexToken = new RegExp(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/)
const brands = ['Visa', 'Master', 'Amex', 'Elo', 'Aura', 'JCB', 'Diners', 'Discover', 'Hipercard']

function error (err) {
  console.log('Ocorreu o seguinte erro', err)
}

brands.forEach(brand => {
  test(brand, async (t) => {
    const tokenParams = {
      'CustomerName': 'Comprádor Teste Cíéló Áá',
      'CardNumber': '4532117080573700',
      'Holder': 'Comprador T Cielo',
      'ExpirationDate': '12/2021',
      'Brand': brand
    }
    const token = await cielo.cards.createTokenizedCard(tokenParams).catch(error)

    t.assert('CardToken' in token, 'retorno cardToken correto')
    t.assert(regexToken.test(token.CardToken), 'CardToken válido')
    
    const vendaParams = {
      'MerchantOrderId': 'CieloNodeJS000003',
      'Customer': {
        'Name': 'Comprádor Teste Cíéló Áá'
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
    const venda = await cielo.creditCard.simpleTransaction(vendaParams).catch(error)
    
    t.assert(venda.Payment.Status === 1, 'Status da Venda Correto')
    t.assert(regexToken.test(venda.Payment.PaymentId), 'venda.Payment.PaymentId válido')
    t.assert(venda.Payment.Amount === vendaParams.Payment.Amount, 'Valor da Transação de Venda correto')
    t.assert(venda.Customer.Name === 'Comprador Teste Cielo Aa', 'Normalização do nome do cliente no boleto')
    
    const capturaParams = {
      paymentId: venda.Payment.PaymentId,
      amount: 70
    }
    const captura = await cielo.creditCard.captureSaleTransaction(capturaParams).catch(error)
    t.assert(captura.Status === 2, 'Status da Captura correto')

    const consultaParams = {
      paymentId: venda.Payment.PaymentId
    }
    const consultaPaymentId = await cielo.consulting.sale(consultaParams).catch(error)

    t.assert(consultaPaymentId.Payment.Status === 2 || consultaPaymentId.Payment.Status === 1, 'Consulta de venda correta')
    t.assert(venda.Payment.Tid === consultaPaymentId.Payment.Tid, 'Tid da Venda Correto')
    t.assert(consultaPaymentId.Payment.CapturedAmount === capturaParams.amount, 'Valor da captura parcial correto')
    
    const consultaParamsMerchantOrderId = {
      merchantOrderId: 'CieloNodeJS000003'
    }
    
    const consultaMerchantOrderId = await cielo.consulting.sale(consultaParamsMerchantOrderId).catch(error)
    t.assert(consultaMerchantOrderId.Payments.filter(x => x.PaymentId === venda.Payment.PaymentId).length > 0, 'Consulta de MerchantOrderId correta')
    
    const cancelaVendaParams = {
      paymentId: venda.Payment.PaymentId
    }
    const cancelaVenda = await cielo.creditCard.cancelSale(cancelaVendaParams).catch(error)
    t.assert(cancelaVenda.Status === 10, 'Status de cancelamento correto')

    t.end()
  })
})

test('cardBin', async (t) => {
  const cardBinParams = {
    cardBin: 402400
  }
  const cardBin = await cielo.consulting.cardBin(cardBinParams).catch(error)

  t.assert(cardBin.Status === '00', 'Status do CardBin válido (cardBin)')
  t.assert(cardBin.Provider === 'VISA', 'Bandeira do CardBin correto (cardBin)')
  t.assert(cardBin.CardType === 'Multiplo', 'Tipo de cartão (cardBin)')
  t.assert(cardBin.ForeignCard === true, 'Cartão emitido no exterior (cardBin)')

  t.end()
})

test('Boleto', async (t) => {
  const boletoParams = {
    'MerchantOrderId': '20180531',
    'Customer': {
      'Name': 'Comprádor Boleto Cíéló Áá',
      'Identity': '1234567890',
      'Address': {
        'Street': 'Avenida Marechal Câmara',
        'Number': '160',
        'Complement': 'Sala 934',
        'ZipCode': '22750012',
        'District': 'Centro',
        'City': 'Rio de Janeiro',
        'State': 'RJ',
        'Country': 'BRA'
      }
    },
    'Payment': {
      'Type': 'Boleto',
      'Amount': 15700,
      'Provider': 'Bradesco2',
      'Address': 'Rua Teste',
      'BoletoNumber': '123',
      'Assignor': 'Empresa Teste',
      'Demonstrative': 'Desmonstrative Teste',
      'ExpirationDate': '5/1/2020',
      'Identification': '11884926754',
      'Instructions': 'Aceitar somente até a data de vencimento, após essa data juros de 1% dia.'
    }
  }
  const boleto = await cielo.boleto.sale(boletoParams).catch(error)

  t.assert(boleto.Customer.Name === 'Comprador Boleto Cielo Aa', 'Normalização do nome do cliente no boleto')
  t.assert(typeof boleto.Code === 'undefined', 'Não ocorreu erro no boleto')
  t.assert(typeof boleto.Payment !== 'undefined', 'Boleto retornou Payment')
  t.assert(boleto.Payment.Url.trim() !== '', 'Retornou Url para o boleto')

  t.end()
})

test('Recurrency', async (t) => {
  const recurrencyParams = {
    'MerchantOrderId': '2014113245231706',
    'Customer': {
      'Name': 'Comprador rec programada'
    },
    'Payment': {
      'Type': 'CreditCard',
      'Amount': 1500,
      'Installments': 1,
      'SoftDescriptor': '123456789ABCD',
      'RecurrentPayment': {
        'AuthorizeNow': 'true',
        'EndDate': '2022-12-01',
        'Interval': 'SemiAnnual'
      },
      'CreditCard': {
        'CardNumber': '1234123412341231',
        'Holder': 'Teste Holder',
        'ExpirationDate': '12/2030',
        'SecurityCode': '262',
        'SaveCard': 'false',
        'Brand': 'Visa'
      }
    }
  }

  const firstRecurrency = await cielo.recurrentPayments.firstScheduledRecurrence(recurrencyParams).catch(error)
  t.assert(firstRecurrency.Payment.RecurrentPayment.ReasonCode === 0, 'Pagamento recorrente criado')
  t.assert(firstRecurrency.Payment.Status === 1, 'Status transacional autorizado (1)')
  t.assert(firstRecurrency.Payment.RecurrentPayment.Interval === 6, 'Intervalo de recorrência correto (6)')

  const modifyRecurrencyParams = {
    'recurrentPaymentId': firstRecurrency.Payment.RecurrentPayment.RecurrentPaymentId,
    'Interval': 1
  }
  const modifyRecurrency = await cielo.recurrentPayments.modify.Interval(modifyRecurrencyParams).catch(error)
  t.assert(modifyRecurrency.statusCode === 200, 'StatusCode da modificação da recorrência para mensal correto (200)')

  const updateCustomer = {
    'recurrentPaymentId': firstRecurrency.Payment.RecurrentPayment.RecurrentPaymentId,
    'Customer': {
      'Name': 'Customer',
      'Email': 'customer@teste.com',
      'Birthdate': '1999-12-12',
      'Identity': '22658954236',
      'IdentityType': 'CPF',
      'Address': {
        'Street': 'Rua Teste',
        'Number': '174',
        'Complement': 'AP 201',
        'ZipCode': '21241140',
        'City': 'Rio de Janeiro',
        'State': 'RJ',
        'Country': 'BRA'
      },
      'DeliveryAddress': {
        'Street': 'Outra Rua Teste',
        'Number': '123',
        'Complement': 'AP 111',
        'ZipCode': '21241111',
        'City': 'Qualquer Lugar',
        'State': 'QL',
        'Country': 'BRA',
        'District': 'Teste'
      }
    }
  }

  const customer = await cielo.recurrentPayments.modify.Customer(updateCustomer).catch(error)
  t.assert(customer.statusCode === 200, 'StatusCode da modificação do Customer correto (200)')

  const endDate = await cielo.recurrentPayments.modify.EndDate({
    'recurrentPaymentId': firstRecurrency.Payment.RecurrentPayment.RecurrentPaymentId,
    'EndDate': '2021-01-09'
  }).catch(error)
  t.assert(endDate.statusCode === 200, 'StatusCode da modificação da recorrência terminar dia 09/01/2021 correto (200)')

  const recurrencyDay = await cielo.recurrentPayments.modify.RecurrencyDay({
    'recurrentPaymentId': firstRecurrency.Payment.RecurrentPayment.RecurrentPaymentId,
    'RecurrencyDay': 10
  }).catch(error)
  t.assert(recurrencyDay.statusCode === 200, 'StatusCode da modificação da recorrência para dia 10 correto (200)')

  const updateAmount = {
    'recurrentPaymentId': firstRecurrency.Payment.RecurrentPayment.RecurrentPaymentId,
    'Amount': 156 // Valor do Pedido em centavos: 156 equivale a R$ 1,56
  }
  const amount = await cielo.recurrentPayments.modify.Amount(updateAmount).catch(error)
  t.assert(amount.statusCode === 200, 'StatusCode da modificação do valor para 156 correto (200)')

  let newRecurrencyDate = new Date()
  newRecurrencyDate.setDate(newRecurrencyDate.getDate() + 7) // Altera para a próxima semana
  let nextRecurrency = `${newRecurrencyDate.getFullYear()}-${newRecurrencyDate.getMonth() + 1}-${newRecurrencyDate.getDate()}`
  const updateNextPaymentDate = {
    'recurrentPaymentId': firstRecurrency.Payment.RecurrentPayment.RecurrentPaymentId,
    'NextPaymentDate': nextRecurrency
  }
  const nextPaymentDate = await cielo.recurrentPayments.modify.NextPaymentDate(updateNextPaymentDate).catch(error)
  t.assert(nextPaymentDate.statusCode === 200, 'StatusCode da modificação da data do próximo pagamento para 15/06/2016 correto (200)')

  const deactivateRecurrencyParams = {
    'recurrentPaymentId': firstRecurrency.Payment.RecurrentPayment.RecurrentPaymentId
  }
  const deactivateRecurrency = await cielo.recurrentPayments.modify.Deactivate(deactivateRecurrencyParams).catch(error)
  t.assert(deactivateRecurrency.statusCode === 200, 'StatusCode da desativação da recorrência correto (200)')

  const recurrencyConsultingParams = {
    'recurrentPaymentId': firstRecurrency.Payment.RecurrentPayment.RecurrentPaymentId
  }
  const recurrencyConsulting = await cielo.recurrentPayments.consulting(recurrencyConsultingParams).catch(error)
  t.assert(recurrencyConsulting.RecurrentPayment.Status === 3, 'Status da recorrência correto (3 - desativada pelo lojista)')
  t.assert(recurrencyConsulting.RecurrentPayment.Interval === 'Monthly', 'Intervalo da recorrência correto (Monthly)')
  t.assert(recurrencyConsulting.Customer.Email === 'customer@teste.com', 'Dados do cliente alterados com sucesso')

  t.end()
})
