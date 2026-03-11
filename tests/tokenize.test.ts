import * as https from 'https';
import { EventEmitter } from 'events';
import {
  TokenizeRequestModel,
  TransactionCreditCardRequestModel,
  ConsultTokenRequestModel,
} from '../src';
import { Cielo, CieloConstructor } from './../src/cielo';
import { EnumCardType, EnumBrands } from '../src/enums';

jest.mock('https');

const CARD_TOKEN = '3e7da12a-9e9e-4c46-9e6f-09c6c0a7700e';
const PAYMENT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

const tokenizeBody = { CardToken: CARD_TOKEN };

const transactionBody = {
  MerchantOrderId: 'CieloNodeJS000003',
  Customer: { Name: 'Comprador Teste Cielo Aa' },
  Payment: {
    Status: 1,
    PaymentId: PAYMENT_ID,
    Amount: 100,
  },
};

const consultCardTokenBody = {
  CardNumber: '55556666****8884',
  Holder: 'Comprador T Cielo',
  ExpirationDate: '12/2021',
  Brand: 'Visa',
};

const regexToken = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/;
const brands = [
  'Visa',
  'Master',
  'Amex',
  'Elo',
  'Aura',
  'JCB',
  'Diners',
  'Discover',
  'Hipercard',
];

const cieloParams: CieloConstructor = {
  merchantId: 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

describe('Tokenize', () => {
  brands.forEach((brand) => {
    test(`Tokenize card brand ${brand}`, async () => {
      const responses = [
        { statusCode: 201, body: tokenizeBody },
        { statusCode: 201, body: transactionBody },
        { statusCode: 200, body: consultCardTokenBody },
      ];

      let index = 0;
      (https.request as jest.Mock).mockImplementation(
        (_opts: any, callback: (res: any) => void) => {
          const response = responses[index] ?? responses[responses.length - 1];
          index++;

          const req = new EventEmitter() as any;
          req.write = jest.fn();
          req.end = jest.fn();

          const mockRes = new EventEmitter() as any;
          mockRes.statusCode = response.statusCode;
          callback(mockRes);
          setImmediate(() => {
            mockRes.emit('data', JSON.stringify(response.body));
            mockRes.emit('end');
          });
          return req;
        }
      );

      const tokenParams: TokenizeRequestModel = {
        customerName: 'Comprádor Teste Cíéló Áá',
        cardNumber: '5555666677778884',
        holder: 'Comprador T Cielo',
        expirationDate: '12/2021',
        brand: brand as EnumBrands,
      };
      const token = await cielo.card.createTokenizedCard(tokenParams);

      expect('cardToken' in token).toBe(true);
      expect(regexToken.test(token.cardToken)).toBe(true);

      const vendaParams: TransactionCreditCardRequestModel = {
        merchantOrderId: 'CieloNodeJS000003',
        customer: { name: 'Comprádor Teste Cíéló Áá' },
        payment: {
          type: EnumCardType.CREDIT,
          amount: 100,
          installments: 1,
          softDescriptor: '123456789ABCD',
          creditCard: {
            cardToken: token.cardToken,
            securityCode: '262',
            brand: brand as EnumBrands,
          },
        },
      };
      const venda = await cielo.creditCard.transaction(vendaParams);

      expect(venda.payment.status).toBe(1);
      expect(regexToken.test(venda.payment.paymentId)).toBe(true);
      expect(venda.payment.amount).toBe(vendaParams.payment.amount);
      expect(venda.customer.name).toBe('Comprador Teste Cielo Aa');

      const consultaCartaoTokenizadoParams: ConsultTokenRequestModel = {
        cardToken: token.cardToken,
      };
      const consultaCartao = await cielo.consult.cardtoken(
        consultaCartaoTokenizadoParams
      );

      expect(consultaCartao.holder).toBe(tokenParams.holder);
      expect(
        consultaCartao.cardNumber.endsWith(
          tokenParams.cardNumber.substr(-4, 4)
        )
      ).toBe(true);
    });
  });
});