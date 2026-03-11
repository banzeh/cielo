import {
  Cielo,
  CieloConstructor,
  TokenizeRequestModel,
  TransactionCreditCardRequestModel,
  ConsultTokenRequestModel,
} from '../../src';
import { EnumBrands, EnumCardType } from '../../src/enums';

const cieloParams: CieloConstructor = {
  merchantId: process.env.CIELO_MERCHANT_ID || 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: process.env.CIELO_MERCHANT_KEY || 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};

const cielo = new Cielo(cieloParams);
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('[Integration] Tokenização de Cartão', () => {
  test('Deve tokenizar cartão, usá-lo em transação e consultar token', async () => {
    const tokenParams: TokenizeRequestModel = {
      customerName: 'Comprador Teste Cielo',
      cardNumber: '5555666677778884',
      holder: 'Comprador T Cielo',
      expirationDate: '12/2030',
      brand: EnumBrands.MASTER,
    };

    const token = await cielo.card.createTokenizedCard(tokenParams);

    expect(token).toBeDefined();
    expect(token.cardToken).toBeTruthy();
    expect(uuidRegex.test(token.cardToken)).toBe(true);

    const vendaParams: TransactionCreditCardRequestModel = {
      merchantOrderId: `TokenIntegration-${Date.now()}`,
      customer: { name: 'Comprador Teste Cielo' },
      payment: {
        type: EnumCardType.CREDIT,
        amount: 10000,
        installments: 1,
        softDescriptor: 'CieloIntegTest',
        creditCard: {
          cardToken: token.cardToken,
          securityCode: '123',
          brand: EnumBrands.MASTER,
        },
      },
    };

    const venda = await cielo.creditCard.transaction(vendaParams);

    expect(venda).toBeDefined();
    expect(venda.payment).toBeDefined();
    expect(uuidRegex.test(venda.payment.paymentId)).toBe(true);
    expect(venda.payment.amount).toBe(vendaParams.payment.amount);

    const consultaCartaoTokenizadoParams: ConsultTokenRequestModel = {
      cardToken: token.cardToken,
    };
    const consultaToken = await cielo.consult.cardtoken(consultaCartaoTokenizadoParams);

    expect(consultaToken).toBeDefined();
    expect(consultaToken.holder).toBe(tokenParams.holder);
    expect(consultaToken.cardNumber.endsWith('8884')).toBe(true);
  });
});
