import { Cielo, CieloConstructor, PixCreateRequestModel } from '../../src';

const cieloParams: CieloConstructor = {
  merchantId: process.env.CIELO_MERCHANT_ID || 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: process.env.CIELO_MERCHANT_KEY || 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};

const cielo = new Cielo(cieloParams);
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('[Integration] Pix', () => {
  test('Deve criar transação Pix e retornar QR Code', async () => {
    const pixParams: PixCreateRequestModel = {
      merchantOrderId: `PixIntegration-${Date.now()}`,
      customer: {
        name: 'Comprador Pix',
      },
      payment: {
        type: 'Pix',
        amount: 10000,
        qrCodeExpiration: 86400,
      },
    };

    const pix = await cielo.pix.create(pixParams);

    expect(pix).toBeDefined();
    expect(pix.payment).toBeDefined();
    expect(uuidRegex.test(pix.payment.paymentId)).toBe(true);
    expect(pix.payment.qrCodeBase64Image).toBeTruthy();
    expect(pix.payment.qrCodeString).toBeTruthy();
    expect(pix.payment.type).toBe('Pix');
    expect(pix.payment.amount).toBe(pixParams.payment.amount);
    expect(pix.payment.status).toBe(12);
    expect(pix.payment.currency).toBe('BRL');
    expect(pix.payment.country).toBe('BRA');
  });

  test('Deve criar transação Pix sem qrCodeExpiration (campo opcional)', async () => {
    const pixParams: PixCreateRequestModel = {
      merchantOrderId: `PixIntegration-${Date.now()}`,
      customer: {
        name: 'Comprador Pix',
      },
      payment: {
        type: 'Pix',
        amount: 500,
      },
    };

    const pix = await cielo.pix.create(pixParams);

    expect(pix).toBeDefined();
    expect(pix.payment.qrCodeBase64Image).toBeTruthy();
    expect(pix.payment.qrCodeString).toBeTruthy();
  });
});
