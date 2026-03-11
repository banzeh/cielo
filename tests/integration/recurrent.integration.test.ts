import {
  Cielo,
  CieloConstructor,
  RecurrentCreateModel,
  RecurrentModifyIntervalModel,
  RecurrentModifyModel,
  ConsultTransactionRecurrentPaymentIdRequestModel,
} from '../../src';
import { EnumBrands, EnumCardType, EnumRecurrentPaymentInterval, EnumRecurrentPaymentUpdateInterval } from '../../src/enums';

const cieloParams: CieloConstructor = {
  merchantId: process.env.CIELO_MERCHANT_ID || 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: process.env.CIELO_MERCHANT_KEY || 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};

const cielo = new Cielo(cieloParams);
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('[Integration] Recorrência', () => {
  test('Deve criar, modificar e desativar uma recorrência', async () => {
    const createParams: RecurrentCreateModel = {
      merchantOrderId: `RecurrentIntegration-${Date.now()}`,
      customer: { name: 'Comprador Recorrente' },
      payment: {
        type: EnumCardType.CREDIT,
        amount: 1500,
        installments: 1,
        softDescriptor: 'RecorrenteTeste',
        currency: 'BRL',
        country: 'BRA',
        recurrentPayment: {
          authorizeNow: true,
          endDate: '2030-12-01',
          interval: EnumRecurrentPaymentInterval.MONTHLY,
        },
        creditCard: {
          cardNumber: '4532117080573700',
          holder: 'Comprador T Cielo',
          expirationDate: '12/2030',
          securityCode: '123',
          saveCard: false,
          brand: EnumBrands.VISA,
        },
      },
    };

    const recurrency = await cielo.recurrent.create(createParams);

    expect(recurrency).toBeDefined();
    expect(recurrency.payment).toBeDefined();
    expect(recurrency.payment.recurrentPayment).toBeDefined();
    expect(
      uuidRegex.test(recurrency.payment.recurrentPayment.recurrentPaymentId)
    ).toBe(true);
    expect(recurrency.payment.status).toBe(1);

    const recurrentPaymentId = recurrency.payment.recurrentPayment.recurrentPaymentId;

    const modifyIntervalParams: RecurrentModifyIntervalModel = {
      paymentId: recurrentPaymentId,
      interval: EnumRecurrentPaymentUpdateInterval.BIMONTHLY,
    };
    const modifyInterval = await cielo.recurrent.modifyInterval(modifyIntervalParams);

    expect(modifyInterval.statusCode).toBe(200);

    const consultParams: ConsultTransactionRecurrentPaymentIdRequestModel = {
      recurrentPaymentId,
    };
    const consulta = await cielo.consult.recurrent(consultParams);

    expect(consulta).toBeDefined();
    expect(consulta.recurrentPayment).toBeDefined();

    const deactivateParams: RecurrentModifyModel = {
      paymentId: recurrentPaymentId,
    };
    const deactivate = await cielo.recurrent.deactivate(deactivateParams);

    expect(deactivate.statusCode).toBe(200);
  });
});
