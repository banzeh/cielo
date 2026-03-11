import { Cielo, CieloConstructor, DebitCardSimpleTransactionRequestModel } from '../../src';
import { EnumBrands, EnumCardType } from '../../src/enums';

const cieloParams: CieloConstructor = {
  merchantId: process.env.CIELO_MERCHANT_ID || 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: process.env.CIELO_MERCHANT_KEY || 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};

const cielo = new Cielo(cieloParams);
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('[Integration] Cartão de Débito', () => {
  test('Deve criar transação de débito e retornar URL de autenticação', async () => {
    const debitCardParams: DebitCardSimpleTransactionRequestModel = {
      merchantOrderId: `DebitIntegration-${Date.now()}`,
      customer: {
        name: 'Comprador Debito',
      },
      payment: {
        type: EnumCardType.DEBIT,
        amount: 15700,
        provider: 'Simulado',
        returnUrl: 'http://www.google.com.br',
        debitCard: {
          cardNumber: '4532117080573703',
          holder: 'Comprador T Cielo',
          expirationDate: '12/2030',
          securityCode: '023',
          brand: EnumBrands.VISA,
        },
      },
    };

    const debitTransaction =
      await cielo.debitCard.createSimpleTransaction(debitCardParams);

    expect(debitTransaction).toBeDefined();
    expect(debitTransaction.payment).toBeDefined();
    expect(uuidRegex.test(debitTransaction.payment.paymentId)).toBe(true);
    expect(debitTransaction.payment.amount).toBe(debitCardParams.payment.amount);
    // Debit card requires 3DS authentication, so the transaction URL must be present
    expect(debitTransaction.payment.authenticationUrl).toBeTruthy();
  });
});
