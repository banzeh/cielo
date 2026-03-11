import * as https from 'https';
import { EventEmitter } from 'events';
import { CieloConstructor, Cielo, PixCreateRequestModel } from '../src';

jest.mock('https');

const pixResponseBody = {
  MerchantOrderId: '20201229',
  Customer: {
    Name: 'Comprador Pix',
  },
  Payment: {
    QrCodeBase64Image: 'iVBORw0KGgoAAAANSUhEUgAAAUAAAAUA',
    QrCodeString:
      '00020101021226360014br.gov.bcb.pix0114+5511912345678520400005303986540510.005802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D',
    PaymentId: '1997be4d-694a-472e-98f0-e7f4b4c8f1e2',
    Type: 'Pix',
    Amount: 100,
    ReceivedDate: '2020-12-29 11:15:35',
    Currency: 'BRL',
    Country: 'BRA',
    Status: 12,
    ReturnCode: '0',
    ReturnMessage: 'Pix gerado com sucesso',
    Links: [
      {
        Method: 'GET',
        Rel: 'self',
        Href: 'https://apiquerysandbox.cieloecommerce.cielo.com.br/1/sales/1997be4d-694a-472e-98f0-e7f4b4c8f1e2',
      },
    ],
  },
};

const cieloParams: CieloConstructor = {
  merchantId: 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

describe('Pix', () => {
  beforeEach(() => {
    (https.request as jest.Mock).mockImplementation(
      (_opts: any, callback: (res: any) => void) => {
        const req = new EventEmitter() as any;
        req.write = jest.fn();
        req.end = jest.fn();
        const mockRes = new EventEmitter() as any;
        mockRes.statusCode = 201;
        callback(mockRes);
        setImmediate(() => {
          mockRes.emit('data', JSON.stringify(pixResponseBody));
          mockRes.emit('end');
        });
        return req;
      }
    );
  });

  test('Pagamento via Pix - deve criar transação com sucesso', async () => {
    const pixParams: PixCreateRequestModel = {
      merchantOrderId: '20201229',
      customer: {
        name: 'Comprador Pix',
      },
      payment: {
        type: 'Pix',
        amount: 100,
      },
    };

    const pixResponse = await cielo.pix.create(pixParams);

    expect(pixResponse).toBeDefined();
    expect(pixResponse.payment).toBeDefined();
    expect(pixResponse.payment.qrCodeBase64Image).not.toBe('');
    expect(pixResponse.payment.qrCodeString).not.toBe('');
    expect(pixResponse.payment.type).toBe('Pix');
    expect(pixResponse.payment.amount).toBe(100);
    expect(pixResponse.payment.status).toBe(12);
    expect(pixResponse.payment.returnMessage).toBe('Pix gerado com sucesso');
  });

  test('Pagamento via Pix - deve retornar paymentId válido', async () => {
    const pixParams: PixCreateRequestModel = {
      merchantOrderId: '20201229',
      customer: {
        name: 'Comprador Pix',
      },
      payment: {
        type: 'Pix',
        amount: 100,
      },
    };

    const pixResponse = await cielo.pix.create(pixParams);

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(uuidRegex.test(pixResponse.payment.paymentId)).toBe(true);
  });

  test('Pagamento via Pix - deve retornar dados do cliente', async () => {
    const pixParams: PixCreateRequestModel = {
      merchantOrderId: '20201229',
      customer: {
        name: 'Comprador Pix',
      },
      payment: {
        type: 'Pix',
        amount: 100,
      },
    };

    const pixResponse = await cielo.pix.create(pixParams);

    expect(pixResponse.customer).toBeDefined();
    expect(pixResponse.customer.name).toBe('Comprador Pix');
  });

  test('Pagamento via Pix - deve retornar links de consulta', async () => {
    const pixParams: PixCreateRequestModel = {
      merchantOrderId: '20201229',
      customer: {
        name: 'Comprador Pix',
      },
      payment: {
        type: 'Pix',
        amount: 100,
      },
    };

    const pixResponse = await cielo.pix.create(pixParams);

    expect(pixResponse.payment.links).toBeDefined();
    expect(Array.isArray(pixResponse.payment.links)).toBe(true);
    expect(pixResponse.payment.links.length).toBeGreaterThan(0);
  });

  test('Pagamento via Pix - deve aceitar qrCodeExpiration opcional', async () => {
    const pixParams: PixCreateRequestModel = {
      merchantOrderId: '20201229',
      customer: {
        name: 'Comprador Pix',
      },
      payment: {
        type: 'Pix',
        amount: 100,
        qrCodeExpiration: 86400,
      },
    };

    const pixResponse = await cielo.pix.create(pixParams);

    expect(pixResponse.payment.qrCodeBase64Image).not.toBe('');
  });

  test('Pagamento via Pix - deve retornar moeda e país corretos', async () => {
    const pixParams: PixCreateRequestModel = {
      merchantOrderId: '20201229',
      customer: {
        name: 'Comprador Pix',
      },
      payment: {
        type: 'Pix',
        amount: 100,
      },
    };

    const pixResponse = await cielo.pix.create(pixParams);

    expect(pixResponse.payment.currency).toBe('BRL');
    expect(pixResponse.payment.country).toBe('BRA');
  });

  test('Pagamento via Pix - deve rejeitar quando a API retorna erro', async () => {
    (https.request as jest.Mock).mockImplementation(
      (_opts: any, callback: (res: any) => void) => {
        const req = new EventEmitter() as any;
        req.write = jest.fn();
        req.end = jest.fn();
        const mockRes = new EventEmitter() as any;
        mockRes.statusCode = 400;
        callback(mockRes);
        setImmediate(() => {
          mockRes.emit(
            'data',
            JSON.stringify([{ Code: 126, Message: 'Credit Card Expiration Date is invalid' }])
          );
          mockRes.emit('end');
        });
        return req;
      }
    );

    const pixParams: PixCreateRequestModel = {
      merchantOrderId: '20201229',
      customer: {
        name: 'Comprador Pix',
      },
      payment: {
        type: 'Pix',
        amount: -1,
      },
    };

    await expect(cielo.pix.create(pixParams)).rejects.toBeDefined();
  });
});
