## cielo

Client para a API 3.0 da Cielo em Typescript/Nodejs

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

### [Recorrência](#recorrencia)
+ [Criando Recorrências](#creating)
+ [Modificando Recorrências](#modifyRecurrence)
  * [Modificando dados do comprador](#modifyRecurrenceCustomer)
  * [Modificando data final da Recorrência](#modifyRecurrenceEndDate)
  * [Modificando intevalo da Recorrência](#modifyRecurrenceInterval)
  * [Modificando dia da Recorrência](#modifyRecurrenceRecurrencyDay)
  * [Modificando o valor da Recorrência](#modifyRecurrenceAmount)
  * [Modificando data do próximo Pagamento](#modifyRecurrenceNextPaymentDate)
  * [Modificando dados do Pagamento da Recorrência](#modifyRecurrencePayment)
  * [Desabilitando um Pedido Recorrente](#modifyRecurrenceDeactivate)
  * [Reabilitando um Pedido Recorrente](#modifyRecurrenceReactivate)

#### [Cartões](#cartoes)
+ [Gerando o token de um cartão](#cartoesToken)

#### [Consultas](#consulta)
+ [Consultando as transações usando PaymentID](#consultaPaymentId)
+ [Consultando as transações usando MerchandOrderID](#consultaMerchandOrderID)
+ [Consulta de Cardbin](#consultaCardbin)
+ [Consulta de Recorrência](#recurrenceConsulting)
+ [Consulta de cartão tokenizado](#consultaTokenized)


#### [API Reference](#apiReference)
#### [Testes](#testes)
#### [Autor](#autor)
#### [License](#license)

## <a name="instalacao"></a> Installation
```js
npm install --save cielo
```

## <a name="howuse"></a> Como utilizar?

### Iniciando
```ts
import { CieloConstructor, Cielo } from 'cielo';

const cieloParams: CieloConstructor = {
    merchantId: 'xxxxxxxxxxxxxxxxxxxxxxx',
    merchantKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    requestId: 'xxxxxxx', // Opcional - Identificação do Servidor na Cielo
    sandbox: true, // Opcional - Ambiente de Testes
    debug: true // Opcional - Exibe os dados enviados na requisição para a Cielo
}

const cielo = new Cielo(cieloParams);
```

### <a name="params"></a> Paramêtros de criação

| Campo | Descrição | Obrigatório? | Default |
| ------------- |:-------------:| -----:| -----:|
| merchantId | Identificador da loja na Cielo. | Sim | null |
| merchantKey | Chave Publica para Autenticação Dupla na Cielo. | Sim | null |
| requestId | Identificador do Request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | Não | null |
| sandbox | Ambiente de testes da Cielo | Não | false |
| debug | Exibe requisição da transação no console | Não | false |

## <a name="creditCard"></a> Cartão de Crédito

### <a name="creditSimpleTransaction"></a>  Criando uma transação simples

Usando Promise

```ts
const vendaParams: TransactionCreditCardRequestModel = {
    customer: {
        name: "Comprador crédito simples",
    },
    merchantOrderId: "2014111703",
    payment: {
        amount: 10000, // R$100,00
        creditCard: {
            brand: EnumBrands.VISA,
            cardNumber: "4532117080573700",
            holder: "Comprador T Cielo",
            expirationDate: "12/2021",
        },
        installments: 1,
        softDescriptor: "Banzeh",
        type: EnumCardType.CREDIT,
        capture: false,
    },
};

cielo.creditCard.transaction(dadosSale)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
```

Ou usando Async / Await

```js
const transaction = await cielo.creditCard.transaction(dadosSale);
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

## <a name="recorrencia"></a> Recorrência

### <a name="creatingRecurrence"></a> Criando Recorrências

```js
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

cielo.recurrentPayments.firstScheduledRecurrence(recurrencyParams)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

Ou usando Async / Await

```js
const firstRecurrency = await cielo.recurrentPayments.firstScheduledRecurrence(recurrencyParams)
```

### <a name="modifyRecurrence"></a> Modificando Recorrências

#### <a name="modifyRecurrenceCustomer"></a> Modificando dados do comprador

```js
const updateCustomer = {
  "recurrentPaymentId": RecurrentPaymentId,
  "Customer": {
    "Name": "Customer",
    "Email": "customer@teste.com",
    "Birthdate": "1999-12-12",
    "Identity": "22658954236",
    "IdentityType": "CPF",
    "Address": {
      "Street": "Rua Teste",
      "Number": "174",
      "Complement": "AP 201",
      "ZipCode": "21241140",
      "City": "Rio de Janeiro",
      "State": "RJ",
      "Country": "BRA"
    },
    "DeliveryAddress": {
      "Street": "Outra Rua Teste",
      "Number": "123",
      "Complement": "AP 111",
      "ZipCode": "21241111",
      "City": "Qualquer Lugar",
      "State": "QL",
      "Country": "BRA",
      "District": "Teste"
    }
  }
}

cielo.recurrentPayments.modify.Customer(updateCustomer)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

Ou usando await

```js
const customer = await cielo.recurrentPayments.modify.Customer(updateCustomer)
```

#### <a name="modifyRecurrenceEndDate"></a> Modificando data final da Recorrência

```js
const updateEndDate = {
  "recurrentPaymentId": RecurrentPaymentId,
  "EndDate": "2021-01-09"
}

cielo.recurrentPayments.modify.EndDate(updateEndDate)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

Ou usando await

```js
const endDate = await cielo.recurrentPayments.modify.EndDate(updateEndDate)
```

#### <a name="modifyRecurrenceInterval"></a> Modificando intevalo da Recorrência

```js
const updateInterval = {
  "recurrentPaymentId": RecurrentPaymentId,
  "Interval": 6, // Modifica para cobrança semestral
}

cielo.recurrentPayments.modify.Interval(updateInterval)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

Ou usando await

```js
const interval = await cielo.recurrentPayments.modify.Interval(updateInterval)
```

#### <a name="modifyRecurrenceRecurrencyDay"></a> Modificando dia da Recorrência

```js
const updateRecurrencyDay = {
  "recurrentPaymentId": RecurrentPaymentId,
  "RecurrencyDay": 10, // Modifica a data da recorrência para o dia 10
}

cielo.recurrentPayments.modify.RecurrencyDay(updateRecurrencyDay)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

Ou usando await

```js
const recurrencyDay = await cielo.recurrentPayments.modify.RecurrencyDay(updateRecurrencyDay)
```

#### <a name="modifyRecurrenceAmount"></a> Modificando o valor da Recorrência

```js
const updateAmount = {
  "recurrentPaymentId": RecurrentPaymentId,
  "Amount": 156 // Valor do Pedido em centavos: 156 equivale a R$ 1,56
}

cielo.recurrentPayments.modify.Amount(updateAmount)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

Ou usando await

```js
const amount = await cielo.recurrentPayments.modify.Amount(updateAmount)
```

#### <a name="modifyRecurrenceNextPaymentDate"></a> Modificando data do próximo Pagamento

```js
const updateNextPaymentDate = {
  "recurrentPaymentId": RecurrentPaymentId,
  "NextPaymentDate": "2016-06-15"
}

cielo.recurrentPayments.modify.NextPaymentDate(updateNextPaymentDate)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

Ou usando await

```js
const nextPaymentDate = await cielo.recurrentPayments.modify.NextPaymentDate(updateNextPaymentDate)
```

#### <a name="modifyRecurrencePayment"></a> Modificando dados do Pagamento da Recorrência

```js
const updatePayment = {
  "recurrentPaymentId": RecurrentPaymentId,
  "Payment": {  
    "Type":"CreditCard",
    "Amount":"123",
    "Installments":3,
    "Country":"USA",
    "Currency":"BRL",
    "SoftDescriptor":"123456789ABCD",
    "CreditCard":{  
        "Brand":"Master",
        "Holder":"Teset card",
        "CardNumber":"1234123412341232",
        "ExpirationDate":"12/2030"
    }
  }
}

cielo.recurrentPayments.modify.Payment(updatePayment)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

Ou usando await

```js
const payment = await cielo.recurrentPayments.modify.Payment(updatePayment)
```

#### <a name="modifyRecurrenceDeactivate"></a> Desabilitando um Pedido Recorrente

```js
const updateDeactivate = {
  "recurrentPaymentId": RecurrentPaymentId
}

cielo.recurrentPayments.modify.Deactivate(updateDeactivate)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

Ou usando await

```js
const deactivate = await cielo.recurrentPayments.modify.Deactivate(updateDeactivate)
```

#### <a name="modifyRecurrenceReactivate"></a> Reabilitando um Pedido Recorrente

```js
const updateReactivate = {
  "recurrentPaymentId": RecurrentPaymentId
}

cielo.recurrentPayments.modify.Reactivate(updateReactivate)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

Ou usando await

```js
const reactivate = await cielo.recurrentPayments.modify.Reactivate(updateReactivate)
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

### <a name="consultaCardbin"></a> Consulta de Cardbin

```js
const cardBinParams = {
  cardBin: 402400
}
cielo.consulting.cardBin(cardBinParams)
.then((data) => {
    console.log(data)
})
.catch((err) => {
    console.log(err);
})
```

Ou usando Async / Await

```js
const cardBinParams = {
  cardBin: 402400
}
const cardBin = await cielo.consulting.cardBin(cardBinParams)
console.log('cardBin', cardBin)
```

### <a name="colsutaTokenized"></a> Consulta de cartão Tokenizado

```js
const dadosConsulta= {
    "token": '66b2c162-efbf-4692-aee5-e536c0f81037'
}

cielo.cards.consultaTokenizedCard(dadosConsulta)
.then((data) => {
    console.log(data)
})
.catch((err) => {
    console.log(err);
})
```

Ou usando Async / Await

```js
const dadosConsulta= {
    "token": '66b2c162-efbf-4692-aee5-e536c0f81037'
}

const card = await cielo.cards.consultaTokenizedCard(dadosConsulta)

console.log('Consulta token', card)
```



### <a name="recurrenceConsulting"></a> Consulta de Recorrência

```js
const recurrencyConsultingParams = {
    "recurrentPaymentId": '66b2c162-efbf-4692-aee5-e536c0f81037'
}

cielo.recurrentPayments.consulting(recurrencyConsultingParams)
.then((data) => {
    console.log(data)
})
.catch((err) => {
    console.log(err);
})
```

Ou usando Async / Await

```js
const recurrencyConsulting = await cielo.recurrentPayments.consulting(recurrencyConsultingParams)
```

## <a name="apiReference"></a> API Reference

Consulte os campos necessários na documentação da Cielo

[PT-Br](https://developercielo.github.io/manual/cielo-ecommerce)

[En](https://developercielo.github.io/en/manual/cielo-ecommerce)

## <a name="testes"></a> Testes

Para rodar os testes automatizados, apenas execute o seguinte comando

```
npm test
```

Também é possível verificar o histórico de builds através do [Travis CI](https://travis-ci.org/banzeh/cielo/builds)

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
