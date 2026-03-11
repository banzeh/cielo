import * as https from 'https';
import { EventEmitter } from 'events';
import { Cielo, CieloConstructor } from './../src/cielo';
import { EnumCardType, EnumBrands } from '../src/enums';
import { DebitCardSimpleTransactionRequestModel } from '../src';

jest.mock('https');

const PAYMENT_ID = '3e7da12a-9e9e-4c46-9e6f-09c6c0a7700e';

const debitCardBody = {
  Payment: {
    Status: 0,
    PaymentId: PAYMENT_ID,
    Amount: 15700,
  },
};

const regexToken = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/;

const cieloParams: CieloConstructor = {
  merchantId: 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

describe('Debit Card', () => {
  test('Cartao de debito', async () => {
    (https.request as jest.Mock).mockImplementation(
      (_opts: any, callback: (res: any) => void) => {
        const req = new EventEmitter() as any;
        req.write = jest.fn();
        req.end = jest.fn();
        const mockRes = new EventEmitter() as any;
        mockRes.statusCode = 201;
        callback(mockRes);
        setImmediate(() => {
          mockRes.emit('data', JSON.stringify(debitCardBody));
          mockRes.emit('end');
        });
        return req;
      }
    );

    const debitCardTransactionParams: DebitCardSimpleTransactionRequestModel = {
      merchantOrderId: '2014121201',
      customer: {
        name: 'Paulo Henrique',
      },
      payment: {
        type: EnumCardType.DEBIT,
        amount: 15700,
        provider: 'Simulado',
        returnUrl: 'http://www.google.com.br',
        debitCard: {
          cardNumber: '4532117080573703',
          holder: 'Teste Holder',
          expirationDate: '12/2022',
          securityCode: '023',
          brand: EnumBrands.VISA,
        },
      },
    };

    const debitCardTransaction =
      await cielo.debitCard.createSimpleTransaction(debitCardTransactionParams);

    expect(debitCardTransaction.payment.status).toBe(0);
    expect(regexToken.test(debitCardTransaction.payment.paymentId)).toBe(true);
    expect(debitCardTransaction.payment.amount).toBe(
      debitCardTransactionParams.payment.amount
    );
  });
});
