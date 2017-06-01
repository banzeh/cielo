var https = require('https'),
	iconv = require('iconv-lite'),
	util = require('util');

module.exports = function (params) {

	var options = {
		hostname: 'apisandbox.cieloecommerce.cielo.com.br',
		port: 443,
		secureProtocol: 'TLSv1_method',
		encoding: 'utf-8',
		headers: {
			'Content-Type': 'application/json',
			'MerchantId': params.MerchantId,
			'MerchantKey': params.MerchantKey,
			'RequestId': params.RequestId
		},
	};

	var postSalesCielo = function (data, callback) {
		var data = JSON.stringify(data);
		options.headers['Content-Length'] = Buffer.byteLength(data);
		options.path = '/1/sales';
		options.method = 'POST';

		var req = https.request(options, function (res) {
			res.on('data', function (chunk) {
				var data = iconv.decode(chunk, 'utf-8');
				callback(null, data)
			});
		});
		req.write(data);
		req.on('error', function (err) {
			callback(err);
		});
		req.end();
	}
	
	var captureSale = function(data, callback){
		options.path = util.format('/1/sales/%s/capture?amount=%s', data.paymentId, data.amount);
		
		if ( data.serviceTaxAmount )
			options.path += util.format('/serviceTaxAmount=%s', data.serviceTaxAmount);

		options.method = 'PUT';

		var req = https.request(options, function (res) {
			res.on('data', function (chunk) {
				var data = iconv.decode(chunk, 'utf-8');
				callback(null, data)
			});
		});
		req.on('error', function (err) {
			callback(err);
		});
		req.end();
	}

	/**
	 * Cancela a venda - Dá preferencia para cancelar pelo paymentId, se não existir, utiliza o OrderId
	 * @param {object} data 
	 * @param {callback} callback 
	 */
	var cancelSale = function(data, callback){
		if (data.paymentId)
			options.path = util.format('/1/sales/%s/void?amount=%s', data.paymentId, data.amount)
		else
			options.path = util.format('/1/sales/OrderId/%s/void?amount=%s', data.merchantOrderId, data.amount);
		
		options.method = 'PUT';

		var req = https.request(options, function (res) {
			res.on('data', function (chunk) {
				var data = iconv.decode(chunk, 'utf-8');
				callback(null, data)
			});
		});
		req.on('error', function (err) {
			callback(err);
		});
		req.end();
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
		}
	}
}