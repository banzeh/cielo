import * as https from 'https';
import { EventEmitter } from 'events';
import { Utils, HttpRequestMethodEnum } from '../src/class/utils';
import { Cielo, CieloConstructor } from '../src/cielo';

jest.mock('https');

const cieloInterface = {
  hostnameTransacao: 'apisandbox.cieloecommerce.cielo.com.br',
  hostnameQuery: 'apiquerysandbox.cieloecommerce.cielo.com.br',
  merchantId: 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
};

function mockHttpsSuccess(body: any, statusCode = 200) {
  (https.request as jest.Mock).mockImplementationOnce(
    (_opts: any, callback: (res: any) => void) => {
      const req = new EventEmitter() as any;
      req.write = jest.fn();
      req.end = jest.fn();
      const mockRes = new EventEmitter() as any;
      mockRes.statusCode = statusCode;
      callback(mockRes);
      setImmediate(() => {
        if (body !== undefined) {
          mockRes.emit('data', JSON.stringify(body));
        }
        mockRes.emit('end');
      });
      return req;
    }
  );
}

function mockHttpsError(statusCode: number, body: any) {
  (https.request as jest.Mock).mockImplementationOnce(
    (_opts: any, callback: (res: any) => void) => {
      const req = new EventEmitter() as any;
      req.write = jest.fn();
      req.end = jest.fn();
      const mockRes = new EventEmitter() as any;
      mockRes.statusCode = statusCode;
      mockRes.statusMessage = 'Bad Request';
      callback(mockRes);
      setImmediate(() => {
        mockRes.emit('data', JSON.stringify(body));
        mockRes.emit('end');
      });
      return req;
    }
  );
}

function mockHttpsNetworkError() {
  (https.request as jest.Mock).mockImplementationOnce(
    (_opts: any, _callback: (res: any) => void) => {
      const req = new EventEmitter() as any;
      req.write = jest.fn();
      req.end = jest.fn();
      setImmediate(() => {
        req.emit('error', new Error('Network error'));
      });
      return req;
    }
  );
}

describe('Utils', () => {
  let utils: Utils;

  beforeEach(() => {
    utils = new Utils(cieloInterface);
    jest.clearAllMocks();
  });

  describe('validateJSON', () => {
    it('should return true for valid JSON', () => {
      expect(utils.validateJSON('{"key":"value"}')).toBeTruthy();
    });

    it('should return false for invalid JSON', () => {
      expect(utils.validateJSON('invalid json !')).toBeFalsy();
    });

    it('should handle simple objects', () => {
      expect(utils.validateJSON('{"Status":1,"Amount":100}')).toBeTruthy();
    });
  });

  describe('getHttpRequestOptions', () => {
    it('should build correct options for GET', () => {
      const options = utils.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: '/1/sales/123',
        hostname: 'apiquerysandbox.cieloecommerce.cielo.com.br',
      });

      expect(options.method).toBe('GET');
      expect(options.path).toBe('/1/sales/123');
      expect(options.hostname).toBe(
        'apiquerysandbox.cieloecommerce.cielo.com.br'
      );
      expect(options.port).toBe(443);
      expect(options.headers['MerchantId']).toBe(cieloInterface.merchantId);
      expect(options.headers['MerchantKey']).toBe(cieloInterface.merchantKey);
    });

    it('should build correct options for POST', () => {
      const options = utils.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/sales/',
        hostname: 'apisandbox.cieloecommerce.cielo.com.br',
      });

      expect(options.method).toBe('POST');
    });
  });

  describe('httpRequest', () => {
    it('should resolve with data on successful POST (201)', async () => {
      const body = { Status: 1, PaymentId: 'abc-123' };
      mockHttpsSuccess(body, 201);

      const options = utils.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/sales/',
        hostname: 'apisandbox.cieloecommerce.cielo.com.br',
      });

      const result = await utils.httpRequest(options, { data: 'test' });
      expect(result.statusCode).toBe(201);
      expect(result.data).toBeDefined();
    });

    it('should resolve with data on successful GET (200)', async () => {
      const body = { PaymentId: 'abc-123', Status: 1 };
      mockHttpsSuccess(body, 200);

      const options = utils.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: '/1/sales/abc-123',
        hostname: 'apiquerysandbox.cieloecommerce.cielo.com.br',
      });

      const result = await utils.httpRequest(options, {});
      expect(result.statusCode).toBe(200);
    });

    it('should resolve with statusCode on successful PUT with empty body', async () => {
      (https.request as jest.Mock).mockImplementationOnce(
        (_opts: any, callback: (res: any) => void) => {
          const req = new EventEmitter() as any;
          req.write = jest.fn();
          req.end = jest.fn();
          const mockRes = new EventEmitter() as any;
          mockRes.statusCode = 200;
          callback(mockRes);
          setImmediate(() => {
            // No data event - empty body
            mockRes.emit('end');
          });
          return req;
        }
      );

      const options = utils.getHttpRequestOptions({
        method: HttpRequestMethodEnum.PUT,
        path: '/1/RecurrentPayment/abc-123/Deactivate',
        hostname: 'apisandbox.cieloecommerce.cielo.com.br',
      });

      const result = await utils.httpRequest(options, '');
      expect(result.statusCode).toBe(200);
    });

    it('should reject on non-200/201 status code', async () => {
      const errorBody = [{ Code: 126, Message: 'Credit Card invalid' }];
      mockHttpsError(400, errorBody);

      const options = utils.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/sales/',
        hostname: 'apisandbox.cieloecommerce.cielo.com.br',
      });

      await expect(utils.httpRequest(options, {})).rejects.toBeDefined();
    });

    it('should reject on network error', async () => {
      mockHttpsNetworkError();

      const options = utils.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/sales/',
        hostname: 'apisandbox.cieloecommerce.cielo.com.br',
      });

      await expect(utils.httpRequest(options, {})).rejects.toBeDefined();
    });
  });

  describe('postToSales', () => {
    it('should post to /1/sales/ and return camelcased data', async () => {
      const body = { Status: 1, PaymentId: 'abc-123' };
      mockHttpsSuccess(body, 201);

      const result = await utils.postToSales<any, any>({ data: 'test' });
      expect(result.status).toBe(1);
      expect(result.paymentId).toBe('abc-123');
    });
  });

  describe('get', () => {
    it('should GET and return camelcased data', async () => {
      const body = { ForeignCard: true, Status: '00' };
      mockHttpsSuccess(body, 200);

      const result = await utils.get<any>({ path: '/1/cardBin/453211' });
      expect(result.foreignCard).toBe(true);
    });
  });
});

describe('Cielo constructor', () => {
  it('should create instance with sandbox=false (production hostnames)', () => {
    const params: CieloConstructor = {
      merchantId: 'test-merchant-id',
      merchantKey: 'test-merchant-key',
      sandbox: false,
    };
    const cieloInstance = new Cielo(params);
    expect(cieloInstance).toBeDefined();
    expect(cieloInstance.creditCard).toBeDefined();
    expect(cieloInstance.debitCard).toBeDefined();
    expect(cieloInstance.card).toBeDefined();
    expect(cieloInstance.consult).toBeDefined();
    expect(cieloInstance.recurrent).toBeDefined();
    expect(cieloInstance.bankSlip).toBeDefined();
    expect(cieloInstance.eletronicTransfer).toBeDefined();
  });

  it('should create instance with debug=true and requestId', () => {
    const params: CieloConstructor = {
      merchantId: 'test-merchant-id',
      merchantKey: 'test-merchant-key',
      sandbox: true,
      debug: true,
      requestId: 'req-123',
    };
    const cieloInstance = new Cielo(params);
    expect(cieloInstance).toBeDefined();
  });

  it('should expose alias properties', () => {
    const params: CieloConstructor = {
      merchantId: 'test',
      merchantKey: 'test',
      sandbox: true,
    };
    const cieloInstance = new Cielo(params);
    expect(cieloInstance.consulta).toBe(cieloInstance.consult);
    expect(cieloInstance.cartao).toBe(cieloInstance.card);
    expect(cieloInstance.recorrencia).toBe(cieloInstance.recurrent);
    expect(cieloInstance.boleto).toBe(cieloInstance.bankSlip);
    expect(cieloInstance.transferenciaEletronica).toBe(
      cieloInstance.eletronicTransfer
    );
  });
});
