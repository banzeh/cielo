import * as https from 'https';
import { EventEmitter } from 'events';
import { CaptureRequestModel } from './../src/models/credit-card/capture.request.model';
import {
  Cielo,
  CieloConstructor,
  TransactionCreditCardRequestModel,
  CancelTransactionRequestModel,
  ConsultTransactionPaymentIdRequestModel,
  ConsultTransactionMerchantOrderIdRequestModel,
} from '../src/index';
import { EnumBrands, EnumCardType } from '../src/enums';

jest.mock('https');

const PAYMENT_ID = '3e7da12a-9e9e-4c46-9e6f-09c6c0a7700e';
const TID = '12345678901234';

const creditCardTransactionBody = {
  MerchantOrderId: 'TypescriptSDK-banzeh',
  Customer: { Name: 'Comprador Teste Cielo Aa' },
  Payment: {
    Status: 1,
    PaymentId: PAYMENT_ID,
    Amount: 10000,
    Tid: TID,
    CapturedAmount: 0,
  },
};

const captureBody = {
  Status: 2,
  ReturnCode: '6',
  ReturnMessage: 'Operation Successful',
};

const consultPaymentIdBody = {
  Customer: { Name: 'Comprador Teste Cielo Aa' },
  Payment: {
    Status: 2,
    PaymentId: PAYMENT_ID,
    Tid: TID,
    CapturedAmount: 2000,
  },
};

const consultMerchantOrderIdBody = {
  Payments: [{ PaymentId: PAYMENT_ID, PaymentType: 'CreditCard' }],
};

const cancelBody = {
  Status: 10,
  ReturnCode: '9',
  ReturnMessage: 'Operation Successful',
};

function setupResponses() {
  const responses = [
    { statusCode: 201, body: creditCardTransactionBody },
    { statusCode: 200, body: captureBody },
    { statusCode: 200, body: consultPaymentIdBody },
    { statusCode: 200, body: consultMerchantOrderIdBody },
    { statusCode: 200, body: cancelBody },
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
}

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

describe('Credit Card', () => {
  brands.forEach((brand) => {
    test(`Card brand ${brand}`, async () => {
      setupResponses();

      const vendaParams: TransactionCreditCardRequestModel = {
        customer: { name: 'Comprádor Teste Cíéló Áá' },
        merchantOrderId: 'TypescriptSDK-banzeh',
        payment: {
          amount: 10000,
          creditCard: {
            brand: brand as EnumBrands,
            cardNumber: '4532117080573700',
            holder: 'Comprador T Cielo',
            expirationDate: '12/2021',
          },
          installments: 1,
          softDescriptor: 'Banzeh',
          type: EnumCardType.CREDIT,
          capture: false,
        },
      };

      const venda = await cielo.creditCard.transaction(vendaParams);

      expect(venda.payment.status).toBe(1);
      expect(regexToken.test(venda.payment.paymentId)).toBe(true);
      expect(venda.payment.amount).toBe(vendaParams.payment.amount);
      expect(venda.customer.name).toBe('Comprador Teste Cielo Aa');

      const capturaParcialParams: CaptureRequestModel = {
        paymentId: venda.payment.paymentId,
        amount: 2000,
      };
      const capturaParcial =
        await cielo.creditCard.captureSaleTransaction(capturaParcialParams);
      expect(capturaParcial.status).toBe(2);

      const consultaParams: ConsultTransactionPaymentIdRequestModel = {
        paymentId: venda.payment.paymentId,
      };
      const consultaPaymentId = await cielo.consult.paymentId(consultaParams);
      expect([1, 2]).toContain(consultaPaymentId.payment.status);
      expect(venda.payment.tid).toBe(consultaPaymentId.payment.tid);
      expect(consultaPaymentId.payment.capturedAmount).toBe(
        capturaParcialParams.amount
      );

      const consultaParamsMerchantOrderId: ConsultTransactionMerchantOrderIdRequestModel =
        { merchantOrderId: 'TypescriptSDK-banzeh' };
      const consultaMerchantOrderId = await cielo.consult.merchantOrderId(
        consultaParamsMerchantOrderId
      );
      expect(
        consultaMerchantOrderId.payments.filter(
          (x) => x.paymentId === venda.payment.paymentId
        ).length
      ).toBeGreaterThan(0);

      const cancelamentoVendaParams: CancelTransactionRequestModel = {
        paymentId: venda.payment.paymentId,
        amount: venda.payment.amount,
      };
      const cancelamentoVenda = await cielo.creditCard.cancelTransaction(
        cancelamentoVendaParams
      );
      expect(cancelamentoVenda.status).toBe(10);
    });
  });

  test('Cancel transaction by merchantOrderId', async () => {
    (https.request as jest.Mock).mockImplementation(
      (_opts: any, callback: (res: any) => void) => {
        const req = new EventEmitter() as any;
        req.write = jest.fn();
        req.end = jest.fn();
        const mockRes = new EventEmitter() as any;
        mockRes.statusCode = 200;
        callback(mockRes);
        setImmediate(() => {
          mockRes.emit('data', JSON.stringify({ Status: 10 }));
          mockRes.emit('end');
        });
        return req;
      }
    );

    const cancelParams: CancelTransactionRequestModel = {
      merchantOrderId: 'TypescriptSDK-banzeh',
      amount: 10000,
    };
    const result = await cielo.creditCard.cancelTransaction(cancelParams);
    expect(result.status).toBe(10);
  });
});
