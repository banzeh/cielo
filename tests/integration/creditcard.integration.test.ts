import {
  Cielo,
  CieloConstructor,
  TransactionCreditCardRequestModel,
  CaptureRequestModel,
  CancelTransactionRequestModel,
  ConsultTransactionPaymentIdRequestModel,
  ConsultTransactionMerchantOrderIdRequestModel,
} from '../../src';
import { EnumBrands, EnumCardType } from '../../src/enums';

const cieloParams: CieloConstructor = {
  merchantId: process.env.CIELO_MERCHANT_ID || 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: process.env.CIELO_MERCHANT_KEY || 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};

const cielo = new Cielo(cieloParams);
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const merchantOrderId = `CieloIntegration-${Date.now()}`;

describe('[Integration] Cartão de Crédito', () => {
  test('Fluxo completo: autorizar, capturar e cancelar transação', async () => {
    const vendaParams: TransactionCreditCardRequestModel = {
      merchantOrderId,
      customer: { name: 'Comprador Teste Cielo' },
      payment: {
        amount: 10000,
        installments: 1,
        softDescriptor: 'CieloIntegTest',
        type: EnumCardType.CREDIT,
        capture: false,
        creditCard: {
          brand: EnumBrands.VISA,
          cardNumber: '4532117080573700',
          holder: 'Comprador T Cielo',
          expirationDate: '12/2030',
        },
      },
    };

    const venda = await cielo.creditCard.transaction(vendaParams);

    expect(venda).toBeDefined();
    expect(venda.payment).toBeDefined();
    expect(uuidRegex.test(venda.payment.paymentId)).toBe(true);
    expect(venda.payment.amount).toBe(vendaParams.payment.amount);
    expect(venda.payment.status).toBe(1);

    const captureParams: CaptureRequestModel = {
      paymentId: venda.payment.paymentId,
      amount: 5000,
    };
    const capture = await cielo.creditCard.captureSaleTransaction(captureParams);

    expect(capture).toBeDefined();
    expect(capture.status).toBe(2);

    const consultaParams: ConsultTransactionPaymentIdRequestModel = {
      paymentId: venda.payment.paymentId,
    };
    const consulta = await cielo.consult.paymentId(consultaParams);

    expect(consulta).toBeDefined();
    expect(consulta.payment.paymentId).toBe(venda.payment.paymentId);

    const cancelParams: CancelTransactionRequestModel = {
      paymentId: venda.payment.paymentId,
    };
    const cancel = await cielo.creditCard.cancelTransaction(cancelParams);

    expect(cancel).toBeDefined();
    expect(cancel.status).toBe(10);
  });

  test('Consulta por MerchantOrderId', async () => {
    const consultaParams: ConsultTransactionMerchantOrderIdRequestModel = {
      merchantOrderId,
    };
    const consulta = await cielo.consult.merchantOrderId(consultaParams);

    expect(consulta).toBeDefined();
    expect(consulta.payments).toBeDefined();
    expect(Array.isArray(consulta.payments)).toBe(true);
    expect(
      consulta.payments.some((p) => p.paymentType === 'CreditCard')
    ).toBe(true);
  });

  test('Cancelamento por MerchantOrderId', async () => {
    const vendaParams: TransactionCreditCardRequestModel = {
      merchantOrderId: `CieloIntegration-Cancel-${Date.now()}`,
      customer: { name: 'Comprador Teste Cielo' },
      payment: {
        amount: 5000,
        installments: 1,
        type: EnumCardType.CREDIT,
        capture: true,
        creditCard: {
          brand: EnumBrands.VISA,
          cardNumber: '4532117080573700',
          holder: 'Comprador T Cielo',
          expirationDate: '12/2030',
        },
      },
    };

    const venda = await cielo.creditCard.transaction(vendaParams);
    expect(venda.payment.paymentId).toBeTruthy();

    const cancelParams: CancelTransactionRequestModel = {
      merchantOrderId: vendaParams.merchantOrderId,
      amount: vendaParams.payment.amount,
    };
    const cancel = await cielo.creditCard.cancelTransaction(cancelParams);

    expect(cancel).toBeDefined();
    expect(cancel.status).toBe(10);
  });
});
