import { Cielo, CieloConstructor } from './../src/cielo';
import test from "tape";
import { TokenizeRequestModel, TransactionCreditCardRequestModel } from '../src';
import { EnumCardType, EnumBrands } from '../src/enums';

const regexToken = new RegExp(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);
const brands = [
  "Visa",
  "Master",
  "Amex",
  "Elo",
  "Aura",
  "JCB",
  "Diners",
  "Discover",
  "Hipercard",
];

const cieloParams: CieloConstructor = {
  merchantId: "dbe5e423-ed15-4c27-843a-fedf325ea67c",
  merchantKey: "NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD",
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

brands.forEach((brand) => {
  test(`Tokenize card brand ${brand}`, async (t) => {
    const tokenParams: TokenizeRequestModel = {
      customerName: 'Comprádor Teste Cíéló Áá',
      cardNumber: '5555666677778884',
      holder: 'Comprador T Cielo',
      expirationDate: '12/2021',
      brand: brand
    };
    const token = await cielo.card.createTokenizedCard(tokenParams);

    t.assert('cardToken' in token, 'retorno cardToken correto');
    t.assert(regexToken.test(token.cardToken), 'CardToken valido');

    // Venda com cartão tokenizado
    const vendaParams: TransactionCreditCardRequestModel = {
      merchantOrderId: 'CieloNodeJS000003',
      customer: {
        name: 'Comprádor Teste Cíéló Áá'
      },
      payment: {
        type: EnumCardType.CREDIT,
        amount: 100,
        installments: 1,
        softDescriptor: '123456789ABCD',
        creditCard: {
          cardToken: token.cardToken,
          securityCode: '262',
          brand: EnumBrands.VISA
        }
      }
    }
    const venda = await cielo.creditCard.transaction(vendaParams);
    t.assert(venda.payment.status === 1, 'Status da Venda Correto')
    t.assert(regexToken.test(venda.payment.paymentId), 'venda.Payment.PaymentId valido')
    t.assert(venda.payment.amount === vendaParams.payment.amount, 'Valor da Transacao de Venda correto')
    t.assert(venda.customer.name === 'Comprador Teste Cielo Aa', 'Normalizacao do nome do cliente no boleto')

    t.end();
  });
});