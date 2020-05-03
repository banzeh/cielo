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

#### [Transferência Eletrônica](#eletronic-transfer)
+ [Criando uma venda simplificada](#eletronic-transfer-transaction)

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
| :-------------: |:-------------:| :-----:| :-----:|
| merchantId | Identificador da loja na Cielo. | Sim | null |
| merchantKey | Chave publica para autenticação dupla na Cielo. | Sim | null |
| requestId | Identificador do Request, utilizado quando o lojista usa diferentes servidores para cada GET/POST/PUT. | Não | null |
| sandbox | Ambiente de testes da Cielo | Não | false |
| debug | Exibe requisição da transação no console | Não | false |

## <a name="creditCard"></a> Cartão de Crédito

### <a name="creditSimpleTransaction"></a>  Criando uma transação

Usando Promise

```ts
const vendaParams: TransactionCreditCardRequestModel = {
    customer: {
        name: "Comprador crédito",
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

```ts
const transaction = await cielo.creditCard.transaction(dadosSale);
console.log(transaction);
```

### <a name="creditSaleCapture"></a> Capturando uma venda
```ts
const capturaVendaParams: CaptureRequestModel = {
    paymentId: '24bc8366-fc31-4d6c-8555-17049a836a07',
    amount: 2000, // Caso o valor não seja definido, captura a venda no valor total
};

cielo.creditCard.captureSaleTransaction(capturaVendaParams)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
```

### <a name="creditCancelSale"></a> Cancelando uma venda
```js
const cancelamentoVendaParams: CancelTransactionRequestModel = {
    paymentId: '24bc8366-fc31-4d6c-8555-17049a836a07',
    amount: 100, // Caso o valor não seja definido, cancela a venda no valor total
};

cielo.creditCard.cancelTransaction(cancelamentoVendaParams)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
```

Ou usando Async / Await

```ts
const cancel = await cielo.creditCard.cancelSale(dadosSale);
console.log(cancel);
```

## <a name="debitCard"></a> Cartão de Débito

### <a name="debitSimpleTransaction"></a> Criando uma venda simplificada
```ts
const debitCardTransactionParams: DebitCardSimpleTransactionRequestModel = {  
    merchantOrderId: "2014121201",
    customer:{  
      name: "Paulo Henrique"     
    },
    payment: {  
      type: EnumCardType.DEBIT,
      amount: 15700,
      provider: "Simulado",
      returnUrl: "http://www.google.com.br",
      debitCard:{  
          cardNumber: "4532117080573703",
          holder: "Teste Holder",
          expirationDate: "12/2022",
          securityCode: "023",
          brand: EnumBrands.VISA
      }
    }
 }

  cielo.debitCard.createSimpleTransaction(debitCardTransactionParams)
    .then((data) => {
        return console.log(data);
    })
    .catch((err) => {
        return console.error('ERRO', err);
    })
```

## <a name="eletronic-transfer"></a> Pagamentos com Transferência Eletronica

### <a name="eletronic-transfer-transaction"></a> Criando uma venda simplificada
```ts
const transferenciaEletronicaParams: EletronicTransferCreateRequestModel = {
    merchantOrderId: '2017051109',
    customer: {
      name: 'Nome do Comprador',
      identity: '12345678909',
      identityType: 'CPF',
      email: 'comprador@cielo.com.br',
      address: {
        street: 'Alameda Xingu',
        number: '512',
        complement: '27 andar',
        zipCode: '12345987',
        city: 'São Paulo',
        state: 'SP',
        country: 'BRA',
        district: 'Alphaville',
      },
    },
    payment: {
      provider: 'Bradesco',
      type: 'EletronicTransfer',
      amount: 10000,
      returnUrl: 'http://www.cielo.com.br',
    },
  };

  cielo.eletronicTransfer.create(transferenciaEletronicaParams)(dadosSale)
  .then((data) => {
      return console.log(data);
  })
  .catch((err) => {
      return console.error('ERRO', err);
  })
```

## <a name="boleto"></a> Boleto

### <a name="boletoSale"></a>  Criando uma venda de Boleto
```ts
const boletoParams: BankSlipCreateRequestModel = {
    merchantOrderId: '20180531',
    customer: {
      name: 'Comprádor Boleto Cíéló Áá',
      identity: '1234567890',
      address: {
        street: 'Avenida Marechal Câmara',
        number: '160',
        complement: 'Sala 934',
        zipCode: '22750012',
        district: 'Centro',
        city: 'Rio de Janeiro',
        state: 'RJ',
        country: 'BRA'
      }
    },
    payment: {
      type: 'Boleto',
      amount: 15700,
      provider: 'Bradesco2',
      address: 'Rua Teste',
      boletoNumber: '123',
      assignor: 'Empresa Teste',
      demonstrative: 'Desmonstrative Teste',
      expirationDate: '5/1/2020',
      identification: '11884926754',
      instructions: 'Aceitar somente até a data de vencimento, após essa data juros de 1% dia.'
    }
  }

  cielo.bankSlip.create(boletoParams)
    .then((data) => {
      return console.log(data);
    })
    .catch((err) => {
      return console.error('ERRO', err);
    })
```

## <a name="recorrencia"></a> Recorrência

### <a name="creatingRecurrence"></a> Criando Recorrências

```ts
const createRecurrencyParams: RecurrentCreateModel = {
    merchantOrderId: '2014113245231706',
    customer: {
      name: 'Comprador rec programada'
    },
    payment: {
      type: EnumCardType.CREDIT,
      amount: 1500,
      installments: 1,
      softDescriptor: '123456789ABCD',
      currency: 'BRL',
      country: 'BRA',
      recurrentPayment: {
        authorizeNow: true,
        endDate: '2022-12-01',
        interval: EnumRecurrentPaymentInterval.SEMIANNUAL
      },
      creditCard: {
        cardNumber: '4024007197692931',
        holder: 'Teste Holder',
        expirationDate: '12/2030',
        securityCode: '262',
        saveCard: false,
        brand: 'Visa' as EnumBrands
      }
    }
  }

  cielo.recurrent.create(createRecurrencyParams)
    .then((data) => {
      return console.log(data);
    })
    .catch((err) => {
      return console.error('ERRO', err);
    })
```

### <a name="modifyRecurrence"></a> Modificando Recorrências

#### <a name="modifyRecurrenceCustomer"></a> Modificando dados do comprador

```ts
const updateCustomer: RecurrentModifyCustomerModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
    customer: {
      name: 'Customer',
      email: 'customer@teste.com',
      birthdate: '1999-12-12',
      identity: '22658954236',
      identityType: 'CPF',
      address: {
        street: 'Rua Teste',
        number: '174',
        complement: 'AP 201',
        zipCode: '21241140',
        city: 'Rio de Janeiro',
        state: 'RJ',
        country: 'BRA'
      },
      deliveryAddress: {
        street: 'Outra Rua Teste',
        number: '123',
        complement: 'AP 111',
        zipCode: '21241111',
        city: 'Qualquer Lugar',
        state: 'QL',
        country: 'BRA',
      }
    }
  }

cielo.recurrent.modifyCustomer(updateCustomer)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

#### <a name="modifyRecurrenceEndDate"></a> Modificando data final da Recorrência

```ts
const updateEndDate: RecurrentModifyEndDateModel = {
  paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
  endDate: '2021-01-09'
}

cielo.recurrent.modifyEndDate(updateEndDate)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

#### <a name="modifyRecurrenceInterval"></a> Modificando intevalo da Recorrência

```ts
const modifyRecurrencyParams: RecurrentModifyIntervalModel = {
  paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
  interval: EnumRecurrentPaymentUpdateInterval.MONTHLY
}

cielo.recurrent.modifyInterval(modifyRecurrencyParams)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

#### <a name="modifyRecurrenceRecurrencyDay"></a> Modificando dia da Recorrência

```ts
const updateRecurrencyDay: RecurrentModifyDayModel = {
    paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
    recurrencyDay: 10
  }

cielo.recurrent.modifyRecurrencyDay(updateRecurrencyDay)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

#### <a name="modifyRecurrenceAmount"></a> Modificando o valor da Recorrência

```ts
const updateAmount: RecurrentModifyAmountModel = {
  paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
  amount: 156 // Valor do Pedido em centavos: 156 equivale a R$ 1,56
}

cielo.recurrent.modifyAmount(updateAmount)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

#### <a name="modifyRecurrenceNextPaymentDate"></a> Modificando data do próximo Pagamento

```ts
const updateNextPaymentDate: RecurrentModifyNextPaymentDateModel = {
  paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
  nextPaymentDate: '2020-05-20'
}

cielo.recurrent.modifyNextPaymentDate
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

#### <a name="modifyRecurrencePayment"></a> Modificando dados do Pagamento da Recorrência (@todo)

```ts
const updatePayment: RecurrentModifyPaymentModel = {
  recurrentPaymentId: RecurrentPaymentId,
  payment: {  
    type: EnumCardType.CREDIT,
    amount: "123",
    installments: 3,
    country: "USA",
    currency: "BRL",
    softDescriptor: "123456789ABCD",
    creditCard: {  
        brand: EnumBrands.VISA,
        holder: "Teset card",
        cardNumber: "1234123412341232",
        expirationDate: "12/2030"
    }
  }
}

cielo.recurrent.modifyPayment(updatePayment)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

#### <a name="modifyRecurrenceDeactivate"></a> Desabilitando um Pedido Recorrente

```ts
const deactivateRecurrencyParams: RecurrentModifyModel = {
  paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId
}

cielo.recurrent.deactivate(deactivateRecurrencyParams)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```
#### <a name="modifyRecurrenceReactivate"></a> Reabilitando um Pedido Recorrente

```ts
const reactivateRecurrencyParams: RecurrentModifyModel = {
  paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId
}

cielo.recurrent.reactivate(updateReactivate)
  .then((data) => {
    return console.log(data);
  })
  .catch((err) => {
    return console.error('ERRO', err);
  })
```

## <a name="cartoes"></a> Cartões

### <a name="cartoesToken"></a> Gerando o token de cartão

```ts
const tokenParams: TokenizeRequestModel = {
  customerName: 'Comprádor Teste Cíéló Áá',
  cardNumber: '5555666677778884',
  holder: 'Comprador T Cielo',
  expirationDate: '12/2021',
  brand: brand as EnumBrands
};

cielo.card.createTokenizedCard(tokenParams)
    .then((data) => {
        console.log(data)
    })
    .catch((err) => {
        console.log(err);
    })
```

## <a name="consulta"></a> Consultas

### <a name="consultaPaymentId"></a> Consulta Transação usando PaymentId

```ts
const consultaParams: ConsultTransactionPaymentIdRequestModel = {
    paymentId: "24bc8366-fc31-4d6c-8555-17049a836a07"
};

cielo.consult.paymentId(consultaParams)
    .then((data) => {
        console.log(data)
    })
    .catch((err) => {
        console.log(err);
    })
```

### <a name="consultaMerchandOrderID"></a> Consultando as transações usando MerchandOrderID

```ts
const consultaParamsMerchantOrderId: ConsultTransactionMerchantOrderIdRequestModel = {
    merchantOrderId: "2014111706"
};

cielo.consult.merchantOrderId(consultaParamsMerchantOrderId)
    .then((data) => {
        console.log(data)
    })
    .catch((err) => {
        console.log(err);
    })
```

### <a name="consultaCardbin"></a> Consulta de Cardbin

```ts
const consultaBinNacionalParams: ConsultBinRequestModel = {
  cardBin: '453211'
};

cielo.consult.bin(consultaBinNacionalParams)
.then((data) => {
    console.log(data)
})
.catch((err) => {
    console.log(err);
})
```

### <a name="colsutaTokenized"></a> Consulta de cartão Tokenizado

```ts
const consultaCartaoTokenizadoParams: ConsultTokenRequestModel= {
    cardToken: '66b2c162-efbf-4692-aee5-e536c0f81037'
}

cielo.consult.cardtoken(consultaCartaoTokenizadoParams)
.then((data) => {
    console.log(data)
})
.catch((err) => {
    console.log(err);
})
```

### <a name="recurrenceConsulting"></a> Consulta de Recorrência

```ts
const recurrencyConsultingParams: ConsultTransactionRecurrentPaymentIdRequestModel = {
  recurrentPaymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId
}

cielo.consult.recurrent(recurrencyConsultingParams)
.then((data) => {
    console.log(data)
})
.catch((err) => {
    console.log(err);
})
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
