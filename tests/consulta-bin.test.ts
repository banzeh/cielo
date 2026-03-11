import * as https from 'https';
import { EventEmitter } from 'events';
import { ConsultBinRequestModel } from './../src/models/consults/consult-bin.request.model';
import { CieloConstructor, Cielo } from './../src/cielo';

jest.mock('https');

const binBody = {
  Status: '00',
  Provider: 'VISA',
  CardType: 'CreditCard',
  ForeignCard: true,
  CorporateCard: false,
};

const cieloParams: CieloConstructor = {
  merchantId: 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

describe('Consulta BIN', () => {
  test('Consulta BIN nacional', async () => {
    (https.request as jest.Mock).mockImplementation(
      (_opts: any, callback: (res: any) => void) => {
        const req = new EventEmitter() as any;
        req.write = jest.fn();
        req.end = jest.fn();
        const mockRes = new EventEmitter() as any;
        mockRes.statusCode = 200;
        callback(mockRes);
        setImmediate(() => {
          mockRes.emit('data', JSON.stringify(binBody));
          mockRes.emit('end');
        });
        return req;
      }
    );

    const consultaBinNacionalParams: ConsultBinRequestModel = {
      cardBin: '453211',
    };
    const consultaBinNacional = await cielo.consult.bin(
      consultaBinNacionalParams
    );
    expect(consultaBinNacional.foreignCard).toBe(true);
  });
});