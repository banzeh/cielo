## cielo

Client para a API 3.0 da Cielo em Node.Js

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)
[![Build Status](https://travis-ci.org/banzeh/cielo.svg?branch=master)](https://travis-ci.org/banzeh/cielo)
[![Known Vulnerabilities](https://snyk.io/test/github/banzeh/cielo/badge.svg?style=flat-square)](https://snyk.io/test/github/banzeh/cielo)
[![codebeat badge](https://codebeat.co/badges/2dc50ca6-f248-4f32-a2c9-4a71785fd8f8)](https://codebeat.co/projects/github-com-banzeh-cielo-master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)

## Índice

#### [Início](#instalacao)
+ [Instalação](#instalacao)
+ [Como Utilizar](#howuse)
+ [Paramêtros de criação](#params)

#### [Cartão de Crédito](#creditCard)
+ [Criando uma transação simples](#creditSimpleTransaction)
+ [Criando uma transação completa](#creditCompleteTransaction)
+ [Criando uma venda com Autenticação](#creditAuthenticationTransaction)
+ [Criando uma venda com Análise de Fraude](#creditFraudTransaction)
+ [Criando uma venda com Card Token](#creditCardTokenTransaction)
+ [Capturando uma venda](#creditSaleCapture)
+ [Cancelando uma venda](#creditCancelSale)

#### [Cartão de Débito](#debitCard)
+ [Criando uma venda simplificada](#debitSimpleTransaction)

#### [Transferência Eletrônica](#bankSlip)
+ [Criando uma venda simplificada](#bankSlipSimpleTransaction)

#### [Boleto](#boleto)
+ [Criando uma venda de Boleto](#boletoSale)

#### [Cartões](#cartoes)
+ [Gerando o token de um cartão](#cartoesToken)

#### [Consultas](#consulta)
+ [Consultando as transações usando PaymentID](#consultaPaymentId)
+ [Consultando as transações usando MerchandOrderID](#consultaMerchandOrderID)


#### [API Reference](#apiReference)
#### [Autor](#autor)
#### [License](#license)

## <a name="instalacao"></a> Installation
```js
npm install --save cielo
```

## <a name="howuse"></a> Como utilizar?

### Iniciando
```js
var paramsCielo = {
    'MerchantId': 'xxxxxxxxxxxxxxxxxxxxxxx',
    'MerchantKey': 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    'RequestId': 'xxxxxxx', // Opcional - Identificação do Servidor na Cielo
    'sandbox': true, // Opcional - Ambiente de Testes
    'debug': true // Opcional - Exibe os dados enviados na requisição para a Cielo
}

var cielo = require('cielo')(paramsCielo);
```

### <a name="params"></a> Paramêtros de criação

| Campo | Descrição | Obrigatório? | Default |
| ------------- |:-------------:| -----:| -----:|
| MerchantId | Identificador da loja na Cielo. | Sim | null |
| MerchantKey | Chave Publica para Autenticação Dupla na Cielo. | Sim | null |
| RequestId | Identificador do Request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | Não | null |
| sandbox | Ambiente de testes da Cielo | Não | false |
| debug | Exibe requisição da transação no console | Não | false |

## <a name="creditCard"></a> Cartão de Crédito

### <a name="creditSimpleTransaction"></a>  Criando uma transação simples

Usando Promise

```js
var dadosSale = {  
   "MerchantOrderId":"2014111703",
   "Customer":{  
      "Name":"Comprador crédito simples"
   },
   "Payment":{  
     "Type":"CreditCard",
     "Amount":15700,
     "Installments":1,
     "SoftDescriptor":"123456789ABCD",
     "CreditCard":{  
         "CardNumber":"0000000000000001",
         "Holder":"Teste Holder",
         "ExpirationDate":"12/2030",
         "SecurityCode":"123",
         "Brand":"Visa"
     }
   }
}

cielo.creditCard.simpleTransaction(dadosSale)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
})
```

Ou usando Async / Await

```js
const transaction = await cielo.creditCard.simpleTransaction(dadosSale);
console.log(transaction);
```

### <a name="creditCompleteTransaction"></a> Criando uma transação completa
```js
cielo.creditCard.completeTransaction(dadosSale)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
})
```

Ou usando Async / Await

```js
const transaction = await cielo.creditCard.completeTransaction(dadosSale);
console.log(transaction);
```

### <a name="creditAuthenticationTransaction"></a> Criando uma venda com Autenticação
```js
cielo.creditCard.authenticationTransaction(dadosSale)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
})
```

Ou usando Async / Await

```js
const transaction = await cielo.creditCard.authenticationTransaction(dadosSale);
console.log(transaction);
```

### <a name="creditFraudTransaction"></a> Criando uma venda com Análise de Fraude
```js
cielo.creditCard.fraudAnalysisTransaction(dadosSale)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
})
```

Ou usando Async / Await

```js
const transaction = await cielo.creditCard.fraudAnalysisTransaction(dadosSale);
console.log(transaction);
```

### <a name="creditCardTokenTransaction"></a> Criando uma venda com Card Token
```js
cielo.creditCard.cardTokenTransaction(dadosSale)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
})
```

Ou usando Async / Await

```js
const transaction = await cielo.creditCard.cardTokenTransaction(dadosSale);
console.log(transaction);
```

### <a name="creditSaleCapture"></a> Capturando uma venda
```js
var dadosSale = {
    paymentId: '01df6e28-6ddd-45db-a095-903c1adb170a',
    amount: '15700'
}

cielo.creditCard.captureSaleTransaction(dadosSale)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
})
```

Ou usando Async / Await

```js
const transaction = await cielo.creditCard.captureSaleTransaction(dadosSale);
console.log(transaction);
```

### <a name="creditCancelSale"></a> Cancelando uma venda
```js
var dadosSale = {
    paymentId: '01df6e28-6ddd-45db-a095-903c1adb170a',
    amount: '15700'
}

cielo.creditCard.cancelSale(dadosSale)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
})
```

Ou usando Async / Await

```js
const cancel = await cielo.creditCard.cancelSale(dadosSale);
console.log(cancel);
```

## <a name="debitCard"></a> Cartão de Débito

### <a name="debitSimpleTransaction"></a> Criando uma venda simplificada
```js
var dadosSale = {  
   "MerchantOrderId":"2014121201",
   "Customer":{  
      "Name":"Comprador Cartão de débito"
   },
   "Payment":{  
     "Type":"DebitCard",
     "Amount":15700,
     "ReturnUrl":"http://www.cielo.com.br",
     "DebitCard":{  
         "CardNumber":"4551870000000183",
         "Holder":"Teste Holder",
         "ExpirationDate":"12/2030",
         "SecurityCode":"123",
         "Brand":"Visa"
     }
   }
}

cielo.debitCard.simpleTransaction(dadosSale)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
})
```

Ou usando Async / Await

```js
const transaction = await cielo.debitCard.simpleTransaction(dadosSale);
console.log(transaction);
```

## <a name="bankSlip"></a> Pagamentos com Transferência Eletronica

### <a name="bankSlipSimpleTransaction"></a> Criando uma venda simplificada
```js
var dadosSale = {  
    "MerchantOrderId":"2014111706",
    "Customer":
    {  
        "Name":"Comprador Transferência Eletronica"
    },
    "Payment":
    {  
        "Type":"EletronicTransfer",
        "Amount":15700,
        "Provider":"Bradesco",
        "ReturnUrl":"http://www.banzeh.com.br"
    }
}

cielo.bankSlip.simpleTransaction(dadosSale)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
})
```

Ou usando Async / Await

```js
const transaction = await cielo.bankSlip.simpleTransaction(dadosSale);
console.log(transaction);
```

## <a name="boleto"></a> Boleto

### <a name="boletoSale"></a>  Criando uma venda de Boleto
```js
var dadosSale = {  
    "MerchantOrderId":"2014111706",
    "Customer":
    {  
        "Name":"Comprador Teste Boleto",
        "Identity": "1234567890",
        "Address":
        {
          "Street": "Avenida Marechal Câmara",
          "Number": "160",  
          "Complement": "Sala 934",
          "ZipCode" : "22750012",
          "District": "Centro",
          "City": "Rio de Janeiro",
          "State" : "RJ",
          "Country": "BRA"
        }
    },
    "Payment":
    {  
        "Type":"Boleto",
        "Amount":15700,
        "Provider":"INCLUIR PROVIDER",
        "Address": "Rua Teste",
        "BoletoNumber": "123",
        "Assignor": "Empresa Teste",
        "Demonstrative": "Desmonstrative Teste",
        "ExpirationDate": "5/1/2015",
        "Identification": "11884926754",
        "Instructions": "Aceitar somente até a data de vencimento, após essa data juros de 1% dia."
    }
}

cielo.boleto.sale(dadosSale)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
})
```

Ou usando Async / Await

```js
const transaction = await cielo.boleto.sale(dadosSale);
console.log(transaction);
```

## <a name="cartoes"></a> Cartões

### <a name="cartoesToken"></a> Gerando o token de cartão

```js
const dados = {
        "CustomerName": "Comprador Teste Cielo",
        "CardNumber": "4532117080573700",
        "Holder": "Comprador T Cielo",
        "ExpirationDate": "12/2021",
        "Brand": "Visa"
    };

cielo.cards.createTokenizedCard(dados)
    .then((data) => {
        console.log(data)
    })
    .catch((err) => {
        console.log(err);
    })
```

Ou usando Async / Await

```js
const token = await cielo.cards.createTokenizedCard(dados)
console.log('token', token);
```

## <a name="consulta"></a> Consultas

### <a name="consultaPaymentId"></a> Consulta Transação usando PaymentId

```js
const dadosConsulta = {
    "paymentId": "24bc8366-fc31-4d6c-8555-17049a836a07"
};

cielo.consulting.sale(dadosConsulta)
    .then((data) => {
        console.log(data)
    })
    .catch((err) => {
        console.log(err);
    })
```

Ou usando Async / Await

```js
const dadosConsulta = {
    "paymentId": "24bc8366-fc31-4d6c-8555-17049a836a07"
};

const token = await cielo.consulting.sale(dados)
console.log('token', token);
```

### <a name="consultaMerchandOrderID"></a> Consultando as transações usando MerchandOrderID

```js
const dadosConsulta = {
    "merchantOrderId": "2014111706"
};

cielo.consulting.sale(dadosConsulta)
    .then((data) => {
        console.log(data)
    })
    .catch((err) => {
        console.log(err);
    })
```

Ou usando Async / Await

```js
const dadosConsulta = {
    "merchantOrderId": "2014111706"
};

const token = await cielo.consulting.sale(dados)
console.log('token', token);
```

## <a name="apiReference"></a> API Reference

Consulte os campos necessários na documentação da Cielo

[PT-Br](http://developercielo.github.io/Webservice-3.0/?shell#integração-api-3.0)

[En](http://developercielo.github.io/Webservice-3.0/english.html#api-integration-3.0)

<!--## Tests

Describe and show how to run the tests with code examples.-->

<!--## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.-->

## <a name="autor"></a> Autor

Flavio Takeuchi <[flavio@banzeh.com.br](mailto:flavio@banzeh.com.br)>

[Github](https://github.com/banzeh)

[Twitter](http://twitter.com/banzeh)

## <a name="license"></a> License

MIT License

Copyright (c) 2017 banzeh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
