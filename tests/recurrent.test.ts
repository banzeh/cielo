import * as https from 'https';
import { EventEmitter } from 'events';
import {
  EnumRecurrentPaymentInterval,
  EnumRecurrentPaymentUpdateInterval,
} from './../src/enums';
import {
  CieloConstructor,
  Cielo,
  RecurrentCreateModel,
  RecurrentModifyIntervalModel,
  RecurrentModifyCustomerModel,
  RecurrentModifyAmountModel,
  RecurrentModifyNextPaymentDateModel,
  RecurrentModifyModel,
  ConsultTransactionRecurrentPaymentIdRequestModel,
} from '../src';
import { EnumCardType, EnumBrands } from '../src/enums';

jest.mock('https');

const RECURRENT_PAYMENT_ID = '3e7da12a-9e9e-4c46-9e6f-09c6c0a7700e';

const recurrentCreateBody = {
  Payment: {
    Status: 1,
    RecurrentPayment: {
      RecurrentPaymentId: RECURRENT_PAYMENT_ID,
      ReasonCode: 0,
      Interval: 6,
    },
  },
};

const modifyOkBody = {};

const recurrentConsultBody = {
  Customer: {
    Name: 'Customer',
    Email: 'customer@teste.com',
  },
  RecurrentPayment: {
    Status: 3,
    Interval: 'Monthly',
  },
};

const errorBody = [{ Code: 126, Message: 'Credit Card Expiration Date invalid' }];

const cieloParams: CieloConstructor = {
  merchantId: 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

describe('Recorrência', () => {
  test('Recorrencia - criação e modificações', async () => {
    // Sequence: create(1) + 6 modify PUTs + consult(1) = 8 requests
    const responses = [
      { statusCode: 201, body: recurrentCreateBody }, // create
      { statusCode: 200, body: modifyOkBody },         // modifyInterval
      { statusCode: 200, body: modifyOkBody },         // modifyCustomer
      { statusCode: 200, body: modifyOkBody },         // modifyEndDate
      { statusCode: 200, body: modifyOkBody },         // modifyRecurrencyDay
      { statusCode: 200, body: modifyOkBody },         // modifyAmount
      { statusCode: 200, body: modifyOkBody },         // modifyNextPaymentDate
      { statusCode: 200, body: modifyOkBody },         // deactivate
      { statusCode: 200, body: recurrentConsultBody }, // consult
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
          const bodyStr = JSON.stringify(response.body);
          if (bodyStr && bodyStr !== '{}') {
            mockRes.emit('data', bodyStr);
          }
          mockRes.emit('end');
        });
        return req;
      }
    );

    const createRecurrencyParams: RecurrentCreateModel = {
      merchantOrderId: '2014113245231706',
      customer: { name: 'Comprador rec programada' },
      payment: {
        type: EnumCardType.CREDIT,
        amount: 1500,
        installments: 1,
        softDescriptor: '123456789ABCD',
        currency: 'BRL',
        country: 'BRA',
        recurrentPayment: {
          authorizeNow: true,
          startDate: '2021-12-01',
          endDate: '2022-12-01',
          interval: EnumRecurrentPaymentInterval.SEMIANNUAL,
        },
        creditCard: {
          cardNumber: '4024007197692931',
          holder: 'Teste Holder',
          expirationDate: '12/2030',
          securityCode: '262',
          saveCard: false,
          brand: 'Visa' as EnumBrands,
        },
      },
    };

    const firstRecurrency = await cielo.recurrent.create(createRecurrencyParams);

    expect(firstRecurrency.payment.recurrentPayment.reasonCode).toBe(0);
    expect(firstRecurrency.payment.status).toBe(1);
    expect(firstRecurrency.payment.recurrentPayment.interval).toBe(6);

    const modifyRecurrencyParams: RecurrentModifyIntervalModel = {
      paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
      interval: EnumRecurrentPaymentUpdateInterval.MONTHLY,
    };
    const modifyRecurrency = await cielo.recurrent.modifyInterval(modifyRecurrencyParams);
    expect(modifyRecurrency.statusCode).toBe(200);

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
          country: 'BRA',
        },
        deliveryAddress: {
          street: 'Outra Rua Teste',
          number: '123',
          complement: 'AP 111',
          zipCode: '21241111',
          city: 'Qualquer Lugar',
          state: 'QL',
          country: 'BRA',
        },
      },
    };
    const customer = await cielo.recurrent.modifyCustomer(updateCustomer);
    expect(customer.statusCode).toBe(200);

    const endDate = await cielo.recurrent.modifyEndDate({
      paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
      endDate: '2021-01-09',
    });
    expect(endDate.statusCode).toBe(200);

    const recurrencyDay = await cielo.recurrent.modifyRecurrencyDay({
      paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
      recurrencyDay: 10,
    });
    expect(recurrencyDay.statusCode).toBe(200);

    const updateAmount: RecurrentModifyAmountModel = {
      paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
      amount: 156,
    };
    const amount = await cielo.recurrent.modifyAmount(updateAmount);
    expect(amount.statusCode).toBe(200);

    let newRecurrencyDate = new Date();
    newRecurrencyDate.setDate(newRecurrencyDate.getDate() + 7);
    let nextRecurrency = `${newRecurrencyDate.getFullYear()}-${
      newRecurrencyDate.getMonth() + 1
    }-${newRecurrencyDate.getDate()}`;
    const updateNextPaymentDate: RecurrentModifyNextPaymentDateModel = {
      paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
      nextPaymentDate: nextRecurrency,
    };
    const nextPaymentDate = await cielo.recurrent.modifyNextPaymentDate(
      updateNextPaymentDate
    );
    expect(nextPaymentDate.statusCode).toBe(200);

    const deactivateRecurrencyParams: RecurrentModifyModel = {
      paymentId: firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
    };
    const deactivateRecurrency = await cielo.recurrent.deactivate(
      deactivateRecurrencyParams
    );
    expect(deactivateRecurrency.statusCode).toBe(200);

    const recurrencyConsultingParams: ConsultTransactionRecurrentPaymentIdRequestModel =
      {
        recurrentPaymentId:
          firstRecurrency.payment.recurrentPayment.recurrentPaymentId,
      };
    const recurrencyConsulting = await cielo.consult.recurrent(
      recurrencyConsultingParams
    );

    expect(recurrencyConsulting.recurrentPayment.status).toBe(3);
    expect(recurrencyConsulting.recurrentPayment.interval).toBe('Monthly');
    expect(recurrencyConsulting.customer.email).toBe('customer@teste.com');
  });

  test('Recorrencia - erro na transação', async () => {
    (https.request as jest.Mock).mockImplementation(
      (_opts: any, callback: (res: any) => void) => {
        const req = new EventEmitter() as any;
        req.write = jest.fn();
        req.end = jest.fn();

        const mockRes = new EventEmitter() as any;
        mockRes.statusCode = 400;
        mockRes.statusMessage = 'Bad Request';

        callback(mockRes);
        setImmediate(() => {
          mockRes.emit('data', JSON.stringify(errorBody));
          mockRes.emit('end');
        });
        return req;
      }
    );

    const testeError: RecurrentCreateModel = {
      merchantOrderId: '12345678',
      customer: { name: 'Fulano de Tal' },
      payment: {
        type: EnumCardType.CREDIT,
        amount: 50,
        installments: 1,
        returnUrl: 'http://google.com.br',
        recurrentPayment: {
          authorizeNow: true,
          endDate: '2020-12-12',
          interval: EnumRecurrentPaymentInterval.MONTHLY,
        },
        creditCard: {
          cardNumber: '522aaa4049 1585 0591',
          holder: 'Fulano de Tal',
          expirationDate: '05/2022',
          securityCode: '111',
          saveCard: false,
          brand: EnumBrands.MASTER,
        },
      },
    };

    const recurrencyError = await cielo.recurrent
      .create(testeError)
      .catch((err) => err);

    expect(recurrencyError.statusCode).not.toBe(200);
  });

  test('Recorrencia - reactivate', async () => {
    (https.request as jest.Mock).mockImplementation(
      (_opts: any, callback: (res: any) => void) => {
        const req = new EventEmitter() as any;
        req.write = jest.fn();
        req.end = jest.fn();
        const mockRes = new EventEmitter() as any;
        mockRes.statusCode = 200;
        callback(mockRes);
        setImmediate(() => {
          mockRes.emit('end');
        });
        return req;
      }
    );

    const reactivateParams: RecurrentModifyModel = {
      paymentId: RECURRENT_PAYMENT_ID,
    };
    const result = await cielo.recurrent.reactivate(reactivateParams);
    expect(result.statusCode).toBe(200);
  });
});
