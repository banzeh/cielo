const
	_test = require('tape-promise').default
	tape = require('tape'),
	test = _test(tape),
	paramsCielo = {
        'MerchantId': 'e60c1e21cf8743d1bc1fbd760fe0aba4',
        'MerchantKey': 'LVYLUTLJYYIXXRUQMXLIMYEDLRVCRWHNGYQFIVIG',
        'sandbox': true,
        'debug': false
	},
	cielo = require('./cielo')(paramsCielo),
	regexToken = new RegExp(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);


test('Cielo', async (t) => {

	const tokenParams = {
		"CustomerName": "Comprador Teste Cielo",
		"CardNumber": "4532117080573700",
		"Holder": "Comprador T Cielo",
		"ExpirationDate": "12/2021",
		"Brand": "Visa"
	};
	const token = await cielo.cards.createTokenizedCard(tokenParams);

	const vendaParams = {
		"MerchantOrderId":"2014111706",
		"Customer":{
		   "Name":"Comprador Teste"
		},
		"Payment":{
		  "Type":"CreditCard",
		  "Amount":100,
		  "Installments":1,
		  "SoftDescriptor":"123456789ABCD",
		  "CreditCard":{
			  "CardToken": token.CardToken,
			  "SecurityCode":"262",
			  "Brand":"Visa"
		  }
		}
	}
	const venda = await cielo.creditCard.simpleTransaction(vendaParams);

	const capturaParams = {
		paymentId: venda.Payment.PaymentId,
		amount: 70
	}
	const captura = await cielo.creditCard.captureSaleTransaction(capturaParams);

	const consultaParams = {
		paymentId: venda.Payment.PaymentId
	}
	const consultaPaymentId = await cielo.consulting.sale(consultaParams);

	t.assert('CardToken' in token, 'retorno cardToken correto');
	t.assert(regexToken.test(token.CardToken), 'CardToken válido');
	t.assert(venda.Payment.Status === 1, 'Status da Venda Correto');
	t.assert(regexToken.test(venda.Payment.PaymentId), 'venda.Payment.PaymentId válido');
	t.assert(consultaPaymentId.Payment.Status == 2 || consultaPaymentId.Payment.Status == 1, 'Consulta de venda correta');
	t.assert(venda.Payment.Tid === consultaPaymentId.Payment.Tid, 'Tid da Venda Correto');
	t.assert(venda.Payment.Amount === vendaParams.Payment.Amount, 'Valor da Transação de Venda correto');
	t.assert(captura.Status === 2, 'Status da Caputra correto');
	t.assert(consultaPaymentId.Payment.CapturedAmount == capturaParams.amount, 'Valor da captura parcial correto');

	t.end();
})
