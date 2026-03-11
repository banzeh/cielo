import * as https from 'https';
import { EventEmitter } from 'events';
import { CieloConstructor, Cielo, EletronicTransferCreateRequestModel } from '../src';

jest.mock('https');

const eletronicTransferBody = {
  Payment: {
    Amount: 10000,
    Url: 'https://pagamento.bradesco.com.br/redirect',
    Status: 0,
  },
};

const cieloParams: CieloConstructor = {
  merchantId: 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

describe('Transferência Eletrônica', () => {
  test('Pagamento via Transferência Eletrônica', async () => {
    (https.request as jest.Mock).mockImplementation(
      (_opts: any, callback: (res: any) => void) => {
        const req = new EventEmitter() as any;
        req.write = jest.fn();
        req.end = jest.fn();
        const mockRes = new EventEmitter() as any;
        mockRes.statusCode = 201;
        callback(mockRes);
        setImmediate(() => {
          mockRes.emit('data', JSON.stringify(eletronicTransferBody));
          mockRes.emit('end');
        });
        return req;
      }
    );

    const transferenciaEletronicaParams: EletronicTransferCreateRequestModel = {
      merchantOrderId: '2017051109',
      customer: {
        name: 'Nome do Comprador',
        identity: '12345678909',
        identityType: 'CPF',
        email: 'comprador@cielo.com.br',
        address: {
          street: 'Alameda Xingu',
          number: '512',
          complement: '27 andar',
          zipCode: '12345987',
          city: 'São Paulo',
          state: 'SP',
          country: 'BRA',
          district: 'Alphaville',
        },
      },
      payment: {
        provider: 'Bradesco',
        type: 'EletronicTransfer',
        amount: 10000,
        returnUrl: 'http://www.cielo.com.br',
      },
    };

    const transferenciaEletronica = await cielo.eletronicTransfer.create(
      transferenciaEletronicaParams
    );

    expect(transferenciaEletronica.payment.amount).toBe(
      transferenciaEletronicaParams.payment.amount
    );
    expect(transferenciaEletronica.payment.url).not.toBe('');
  });
});
