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
	regexCardToken = RegExp('\w{8}\D{1}\w{4}\D\w{4}\D\w{4}\D\w{12}$');

test('cielo', async (t) => {
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
	const venda = await cielo.creditCard.simpleTransaction(vendaParams).catch((err) => {console.log('ERRO', err)});
	
	const capturaParams = {
		paymentId: venda.Payment.PaymentId,
		amount: 70
	}
	const captura = await cielo.creditCard.captureSaleTransaction(capturaParams).catch((err) => {console.log('ERRO', err)});
	
	t.assert('CardToken' in token, 'retorno cardToken correto');
	t.assert(regexCardToken.test(token.CardToken), 'CardToken válido'); // TODO verificar
	t.assert(venda.Payment.Status === 1, 'Status correto');
	t.assert(venda.Payment.Status === 1, 'Status correto');


	t.end();
})