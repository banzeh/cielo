var https = require('https'),
	iconv = require('iconv-lite'),
	util = require('util');

module.exports = (params) => {
	/**
	 * Caso o flag debug for true, retorna o log no console
	 */
	var log = function () {
		if (debug)
			console.log('------------ DEBUG ------------\n', new Date, '\n\n', arguments, '\n\n------------ END DEBUG ------------\n');
	}

	var debug = params.debug || false;

	var options = {
		port: 443,
		secureProtocol: 'TLSv1_method',
		encoding: 'utf-8',
		headers: {
			'Content-Type': 'application/json',
			'MerchantId': params.MerchantId,
			'MerchantKey': params.MerchantKey,
			'RequestId': params.RequestId || ''
		},
	};

	function getHostname(type){
		switch(type){
			case 'requisicao':
				if (params.sandbox)
					return 'apisandbox.cieloecommerce.cielo.com.br'
				else
					return 'api.cieloecommerce.cielo.com.br';
				break;
			case 'consulta':
				if (params.sandbox)
					return 'apiquerysandbox.cieloecommerce.cielo.com.br'
				else
					return 'apiquery.cieloecommerce.cielo.com.br';
				break;
			default:
				return 'ERROR - HOSTNAME OPTIONS INVÁLIDO';
		}
	}

	const r = function(requestOptions, data, resolve, reject) {
		var opt = Object.assign(options, requestOptions);
		const d = JSON.stringify(data);
		opt.headers['Content-Length'] = Buffer.byteLength(d);
		var req = https.request(opt, (res) => {
			var r = '';
			res.on('data', (chunk) => {
				try {
					r += iconv.decode(chunk, 'utf-8');
				} finally {
					log(r);
				}
			});

			res.on('end', () => {
				try {
					r = JSON.parse(r);
				} catch (err) {
					return reject(err);
				}
				log('res.on(end)', r);
				return resolve(r);		
			})
		});
		req.on('error', (err) => {
			reject(err);
		});
		req.write(d);
		req.end();
	}

	var postSalesCielo = (data) => {
		return new Promise((resolve, reject) => {
			const o = {
				hostname: getHostname('requisicao'),
				path: '/1/sales',
				method: 'POST'
			}
			r(o, data, resolve, reject);
		})
	}

	var captureSale = (data) => {
		return new Promise((resolve, reject) => {
			var o = {
				hostname: getHostname('requisicao'),
				path: util.format('/1/sales/%s/capture?amount=%s', data.paymentId, data.amount)
			}

			if (data.serviceTaxAmount)
				o.path += util.format('/serviceTaxAmount=%s', data.serviceTaxAmount);

			options.method = 'PUT';
			r(o, data, resolve, reject);
		})
	}

	/**
	 * Cancela a venda - Dá preferencia para cancelar pelo paymentId, se não existir, utiliza o OrderId
	 * @param {object} data
	 * @param {callback} callback
	 */
	var cancelSale = (data) => {
		return new Promise((resolve, reject) => {
			var o = { 
				hostname: getHostname('requisicao'),
				method: 'PUT'
			};

			if (data.paymentId)
				o.path = util.format('/1/sales/%s/void?amount=%s', data.paymentId, data.amount)
			else
				o.path = util.format('/1/sales/OrderId/%s/void?amount=%s', data.merchantOrderId, data.amount);

			r(o, data, resolve, reject);
		});
	}

	var modifyingRecurrence = (data) => {
		return new Promise((resolve, reject) => {
			
			const o = {
				hostname: getHostname('requisicao'),
				path: util.format('/1/RecurrentPayment/%s/%s', data.recurrentPaymentId, data.type),
				method: 'PUT'
			}

			r(o, data, resolve, reject);
		});
	}

	var createTokenizedCard = (data) => {
		return new Promise((resolve, reject) => {
			const o = {
				hostname: getHostname('requisicao'),
				path: '/1/card',
				method: 'POST'
			}

			r(o, data, resolve, reject);
		})
	}

	var consultaCielo = (data) => {
		return new Promise((resolve, reject) => {
			const o = {
				hostname: getHostname('consulta'),
				path: (typeof data.paymentId !== 'undefined') ? util.format('/1/sales/%s', data.paymentId) : util.format('/1/sales?merchantOrderId=%s', data.merchantOrderId),
				method: 'GET'
			}
			
			r(o, data, resolve, reject);
		});
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
			createTokenizedCard: createTokenizedCard,
		},
		consulting: {
			sale: consultaCielo,
			storeIndetifier: consultaCielo,
			fraudAnalysis: consultaCielo
		}
	}
}
