import * as https from 'https';
import { EventEmitter } from 'events';
import { CieloConstructor, Cielo, BankSlipCreateRequestModel } from '../src';

jest.mock('https');

const bankSlipBody = {
  Customer: { Name: 'Comprador Boleto Cielo Aa' },
  Payment: {
    Url: 'https://boleto.url/boleto123',
    Status: 1,
    Amount: 15700,
  },
};

const cieloParams: CieloConstructor = {
  merchantId: 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

describe('Bank Slip', () => {
  test('Pagamento via boleto', async () => {
    (https.request as jest.Mock).mockImplementation(
      (_opts: any, callback: (res: any) => void) => {
        const req = new EventEmitter() as any;
        req.write = jest.fn();
        req.end = jest.fn();
        const mockRes = new EventEmitter() as any;
        mockRes.statusCode = 201;
        callback(mockRes);
        setImmediate(() => {
          mockRes.emit('data', JSON.stringify(bankSlipBody));
          mockRes.emit('end');
        });
        return req;
      }
    );

    const boletoParams: BankSlipCreateRequestModel = {
      merchantOrderId: '20180531',
      customer: {
        name: 'Comprádor Boleto Cíéló Áá',
        identity: '1234567890',
        address: {
          street: 'Avenida Marechal Câmara',
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
        demonstrative: 'Desmonstrative Teste',
        expirationDate: '5/1/2020',
        identification: '11884926754',
        instructions:
          'Aceitar somente até a data de vencimento, após essa data juros de 1% dia.',
      },
    };

    const boleto = await cielo.bankSlip.create(boletoParams);

    expect(boleto.customer.name).toBe('Comprador Boleto Cielo Aa');
    expect(boleto.payment).toBeDefined();
    expect(boleto.payment.url.trim()).not.toBe('');
  });
});