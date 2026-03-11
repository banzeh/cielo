import { Cielo, CieloConstructor, BankSlipCreateRequestModel } from '../../src';

const cieloParams: CieloConstructor = {
  merchantId: process.env.CIELO_MERCHANT_ID || 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: process.env.CIELO_MERCHANT_KEY || 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};

const cielo = new Cielo(cieloParams);

describe('[Integration] Boleto', () => {
  test('Deve criar um boleto e retornar URL de pagamento', async () => {
    const boletoParams: BankSlipCreateRequestModel = {
      merchantOrderId: `BoletoIntegration-${Date.now()}`,
      customer: {
        name: 'Comprador Boleto Cielo',
        identity: '1234567890',
        address: {
          street: 'Avenida Marechal Camara',
          number: '160',
          complement: 'Sala 934',
          zipCode: '22750012',
          district: 'Centro',
          city: 'Rio de Janeiro',
          state: 'RJ',
          country: 'BRA',
        },
      },
      payment: {
        type: 'Boleto',
        amount: 15700,
        provider: 'Bradesco2',
        address: 'Rua Teste',
        boletoNumber: '123',
        assignor: 'Empresa Teste',
        demonstrative: 'Demonstrative Teste',
        expirationDate: '12/2030',
        identification: '11884926754',
        instructions:
          'Aceitar somente ate a data de vencimento, apos essa data juros de 1% dia.',
      },
    };

    const boleto = await cielo.bankSlip.create(boletoParams);

    expect(boleto).toBeDefined();
    expect(boleto.payment).toBeDefined();
    expect(boleto.payment.url).toBeTruthy();
    expect(boleto.payment.url.trim()).not.toBe('');
  });
});
