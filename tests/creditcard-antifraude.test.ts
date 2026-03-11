import * as https from 'https';
import { EventEmitter } from 'events';
import { CaptureRequestModel } from './../src/models/credit-card/capture.request.model';
import {
  Cielo,
  CieloConstructor,
  TransactionCreditCardRequestModel,
  CancelTransactionRequestModel,
  ConsultTransactionPaymentIdRequestModel,
  ConsultTransactionMerchantOrderIdRequestModel,
} from '../src/index';
import {
  EnumBrands,
  EnumCardType,
  EnumSequenceCriteria,
  EnumTypeFlowAnalysisFraud,
  EnumCartCategory,
  EnumCartHostHedge,
  EnumCartNonSensicalHedge,
  EnumCartObscenitiesHedge,
  EnumCartPhoneHedge,
  EnumCartTimeHedge,
  EnumCartType,
  EnumCartVelocityHedge,
  EnumShippingMethod,
  EnumTravelJourneyType,
  EnumTravelPassengersStatus,
  EnumTravelPassengersRating,
} from '../src/enums';

jest.mock('https');

const PAYMENT_ID = '3e7da12a-9e9e-4c46-9e6f-09c6c0a7700e';
const TID = '12345678901234';

const creditCardAntiFraudeBody = {
  MerchantOrderId: 'TypescriptSDK-banzeh',
  Customer: { Name: 'Comprador Teste Cielo Aa' },
  Payment: {
    Status: 1,
    PaymentId: PAYMENT_ID,
    Amount: 10000,
    Tid: TID,
    CapturedAmount: 0,
    FraudAnalysis: { Status: 4 },
  },
};

const captureBody = {
  Status: 2,
  ReturnCode: '6',
  ReturnMessage: 'Operation Successful',
};

const consultPaymentIdBody = {
  Customer: { Name: 'Comprador Teste Cielo Aa' },
  Payment: {
    Status: 2,
    PaymentId: PAYMENT_ID,
    Tid: TID,
    CapturedAmount: 2000,
  },
};

const consultMerchantOrderIdBody = {
  Payments: [{ PaymentId: PAYMENT_ID, PaymentType: 'CreditCard' }],
};

const cancelBody = {
  Status: 10,
  ReturnCode: '9',
  ReturnMessage: 'Operation Successful',
};

function setupResponses() {
  const responses = [
    { statusCode: 201, body: creditCardAntiFraudeBody },
    { statusCode: 200, body: captureBody },
    { statusCode: 200, body: consultPaymentIdBody },
    { statusCode: 200, body: consultMerchantOrderIdBody },
    { statusCode: 200, body: cancelBody },
  ];

  let index = 0;
  (https.request as jest.Mock).mockImplementation(
    (_opts: any, callback: (res: any) => void) => {
      const response = responses[index] ?? responses[responses.length - 1];
      index++;

      const req = new EventEmitter() as any;
      req.write = jest.fn();
      req.end = jest.fn();

      const mockRes = new EventEmitter() as any;
      mockRes.statusCode = response.statusCode;

      callback(mockRes);
      setImmediate(() => {
        mockRes.emit('data', JSON.stringify(response.body));
        mockRes.emit('end');
      });

      return req;
    }
  );
}

const regexToken = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/;
const brands = [
  'Visa',
  'Master',
  'Amex',
  'Elo',
  'Aura',
  'JCB',
  'Diners',
  'Discover',
  'Hipercard',
];

const cieloParams: CieloConstructor = {
  merchantId: 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

describe('Credit Card Antifraude', () => {
  brands.forEach((brand) => {
    test(`Card brand antifraude ${brand}`, async () => {
      setupResponses();

      const vendaParams: TransactionCreditCardRequestModel = {
        customer: { name: 'Comprádor Teste Cíéló Áá' },
        merchantOrderId: 'TypescriptSDK-banzeh',
        payment: {
          amount: 10000,
          creditCard: {
            brand: brand as EnumBrands,
            cardNumber: '4532117080573700',
            holder: 'Comprador T Cielo',
            expirationDate: '12/2021',
          },
          installments: 1,
          softDescriptor: 'Banzeh',
          type: EnumCardType.CREDIT,
          capture: false,
          fraudAnalysis: {
            provider: 'Cybersource',
            sequence: EnumTypeFlowAnalysisFraud.AnalyseFirst,
            sequenceCriteria: EnumSequenceCriteria.OnSuccess,
            captureOnLowRisk: false,
            voidOnHighRisk: false,
            totalOrderAmount: 10000,
            browser: {
              browserFingerprint: '074c1ee676ed4998ab66491013c565e2',
              cookiesAccepted: false,
              email: 'comprador@test.com.br',
              hostName: 'Teste',
              ipAddress: '127.0.0.1',
              type: 'Chrome',
            },
            Cart: {
              isGift: false,
              returnsAccepted: true,
              items: [
                {
                  giftCategory: EnumCartCategory.Off,
                  hostHedge: EnumCartHostHedge.Off,
                  nonSensicalHedge: EnumCartNonSensicalHedge.Off,
                  obscenitiesHedge: EnumCartObscenitiesHedge.Off,
                  phoneHedge: EnumCartPhoneHedge.Off,
                  name: 'ItemTeste1',
                  quantity: 1,
                  sku: '20170511',
                  unitPrice: 10000,
                  risk: 'High',
                  timeHedge: EnumCartTimeHedge.High,
                  type: EnumCartType.Coupon,
                  velocityHedge: EnumCartVelocityHedge.High,
                },
              ],
            },
            merchantDefinedFields: [
              { id: 2, value: '100' },
              { id: 4, value: 'Web' },
              { id: 9, value: 'SIM' },
            ],
            shipping: {
              addressee: 'João das Couves',
              method: EnumShippingMethod.LowCost,
              phone: '551121840540',
            },
            travel: {
              journeyType: EnumTravelJourneyType.OneWayTrip,
              departureTime: '2018-01-09 18:00',
              passengers: [
                {
                  name: 'Passenger Test',
                  identity: '212424808',
                  status: EnumTravelPassengersStatus.Gold,
                  rating: EnumTravelPassengersRating.Adult,
                  email: 'email@mail.com',
                  phone: '5564991681074',
                  travelLegs: [{ origin: 'AMS', destination: 'GIG' }],
                },
              ],
            },
          },
        },
      };

      const venda = await cielo.creditCard.transaction(vendaParams);

      expect(venda.payment.fraudAnalysis?.status).toBe(4);
      expect(venda.payment.status).toBe(1);
      expect(regexToken.test(venda.payment.paymentId)).toBe(true);
      expect(venda.payment.amount).toBe(vendaParams.payment.amount);
      expect(venda.customer.name).toBe('Comprador Teste Cielo Aa');

      const capturaParcialParams: CaptureRequestModel = {
        paymentId: venda.payment.paymentId,
        amount: 2000,
      };
      const capturaParcial =
        await cielo.creditCard.captureSaleTransaction(capturaParcialParams);
      expect(capturaParcial.status).toBe(2);

      const consultaParams: ConsultTransactionPaymentIdRequestModel = {
        paymentId: venda.payment.paymentId,
      };
      const consultaPaymentId = await cielo.consult.paymentId(consultaParams);
      expect([1, 2]).toContain(consultaPaymentId.payment.status);
      expect(venda.payment.tid).toBe(consultaPaymentId.payment.tid);
      expect(consultaPaymentId.payment.capturedAmount).toBe(
        capturaParcialParams.amount
      );

      const consultaParamsMerchantOrderId: ConsultTransactionMerchantOrderIdRequestModel =
        { merchantOrderId: 'TypescriptSDK-banzeh' };
      const consultaMerchantOrderId = await cielo.consult.merchantOrderId(
        consultaParamsMerchantOrderId
      );
      expect(
        consultaMerchantOrderId.payments.filter(
          (x) => x.paymentId === venda.payment.paymentId
        ).length
      ).toBeGreaterThan(0);

      const cancelamentoVendaParams: CancelTransactionRequestModel = {
        paymentId: venda.payment.paymentId,
        amount: venda.payment.amount,
      };
      const cancelamentoVenda = await cielo.creditCard.cancelTransaction(
        cancelamentoVendaParams
      );
      expect(cancelamentoVenda.status).toBe(10);
    });
  });
});
