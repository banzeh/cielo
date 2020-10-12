import { CaptureRequestModel } from './../src/models/credit-card/capture.request.model';
import test from "tape";
import {
    Cielo,
    CieloConstructor,
    TransactionCreditCardRequestModel,
    CancelTransactionRequestModel,
    ConsultTransactionPaymentIdRequestModel,
    ConsultTransactionMerchantOrderIdRequestModel,
} from "../src/index";
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
    EnumTravelPassengersRating
} from "../src/enums";

const regexToken = new RegExp(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);
const brands = [
    "Visa",
    "Master",
    "Amex",
    "Elo",
    "Aura",
    "JCB",
    "Diners",
    "Discover",
    "Hipercard",
];

const cieloParams: CieloConstructor = {
    merchantId: "dbe5e423-ed15-4c27-843a-fedf325ea67c",
    merchantKey: "NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD",
    sandbox: true,
};
const cielo = new Cielo(cieloParams);

function error(err: Object) {
    console.log('Ocorreu o seguinte erro ao realizar teste antifraude', err)
}


brands.forEach((brand) => {
    test(`Card brand antifraude ${brand}`, async (t) => {
        const vendaParams: TransactionCreditCardRequestModel = {
            customer: {
                name: "Comprádor Teste Cíéló Áá",
            },
            merchantOrderId: "TypescriptSDK-banzeh",
            payment: {
                amount: 10000,
                creditCard: {
                    brand: brand as EnumBrands,
                    cardNumber: "4532117080573700",
                    holder: "Comprador T Cielo",
                    expirationDate: "12/2021",
                },
                installments: 1,
                softDescriptor: "Banzeh",
                type: EnumCardType.CREDIT,
                capture: false,
                fraudAnalysis: {
                    provider: "Cybersource",
                    sequence: EnumTypeFlowAnalysisFraud.AnalyseFirst,
                    sequenceCriteria: EnumSequenceCriteria.OnSuccess,
                    captureOnLowRisk: false,
                    voidOnHighRisk: false,
                    totalOrderAmount: 10000,
                    browser: {
                        browserFingerprint: "074c1ee676ed4998ab66491013c565e2",
                        cookiesAccepted: false,
                        email: "comprador@test.com.br",
                        hostName: "Teste",
                        ipAddress: "127.0.0.1",
                        type: "Chrome"
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
                                name: "ItemTeste1",
                                quantity: 1,
                                sku: "20170511",
                                unitPrice: 10000,
                                risk: "High",
                                timeHedge: EnumCartTimeHedge.High,
                                type: EnumCartType.Coupon,
                                velocityHedge: EnumCartVelocityHedge.High
                            }
                        ]
                    },
                    merchantDefinedFields: [
                        {
                            id: 2,
                            value: "100"
                        },
                        {
                            id: 4,
                            value: "Web"
                        },
                        {
                            id: 9,
                            value: "SIM"
                        }
                    ],
                    shipping: {
                        addressee: "João das Couves",
                        method: EnumShippingMethod.LowCost,
                        phone: "551121840540"
                    },
                    travel: {
                        journeyType: EnumTravelJourneyType.OneWayTrip,
                        departureTime: "2018-01-09 18:00",
                        passengers: [
                            {
                                name: "Passenger Test",
                                identity: "212424808",
                                status: EnumTravelPassengersStatus.Gold,
                                rating: EnumTravelPassengersRating.Adult,
                                email: "email@mail.com",
                                phone: "5564991681074",
                                travelLegs: [
                                    {
                                        origin: "AMS",
                                        destination: "GIG"
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
        };
        const venda = await cielo.creditCard.transaction(vendaParams).catch(error);
        if (!venda) {
            return;
        }
        t.assert(venda.payment.fraudAnalysis && venda.payment.fraudAnalysis.status === 4, 'Status para abortar retornado pelo Antifraude');

        t.assert(venda.payment.status === 1, "Status da Venda Correto Com Antifraude");
        t.assert(
            regexToken.test(venda.payment.paymentId),
            "venda.Payment.PaymentId valido com Antifraude"
        );
        t.assert(
            venda.payment.amount === vendaParams.payment.amount,
            "Valor da Transacao de Venda correto com Antifraude"
        );
        t.assert(
            venda.customer.name === "Comprador Teste Cielo Aa",
            "Normalizacao do nome do cliente no boleto com Antifraude"
        );

        const capturaParcialParams: CaptureRequestModel = {
            paymentId: venda.payment.paymentId,
            amount: 2000,
        };
        const capturaParcial = await cielo.creditCard.captureSaleTransaction(capturaParcialParams).catch(error);
        if (capturaParcial) {
            t.assert(capturaParcial.status === 2, 'Status da Captura Parcial correto com Antifraude');
        }

        const consultaParams: ConsultTransactionPaymentIdRequestModel = {
            paymentId: venda.payment.paymentId,
        }
        const consultaPaymentId = await cielo.consult.paymentId(consultaParams).catch(error);

        if (consultaPaymentId) {
            t.assert(consultaPaymentId.payment.status === 2 || consultaPaymentId.payment.status === 1, 'Consulta de venda correta com Antifraude')
            t.assert(venda.payment.tid === consultaPaymentId.payment.tid, 'Tid da Venda Correto com Antifraude')
            t.assert(consultaPaymentId.payment.capturedAmount === capturaParcialParams.amount, 'Valor da captura parcial correto com Antifraude')
        }

        const consultaParamsMerchantOrderId: ConsultTransactionMerchantOrderIdRequestModel = {
            merchantOrderId: 'TypescriptSDK-banzeh'
        }

        const consultaMerchantOrderId = await cielo.consult.merchantOrderId(consultaParamsMerchantOrderId).catch(error);
        if (consultaMerchantOrderId) {
            t.assert(consultaMerchantOrderId.payments.filter(x => x.paymentId === venda.payment.paymentId).length > 0, 'Consulta de MerchantOrderId correta com Antifraude')
        }


        const cancelamentoVendaParams: CancelTransactionRequestModel = {
            paymentId: venda.payment.paymentId,
            amount: venda.payment.amount,
        };
        const cancelamentoVenda = await cielo.creditCard.cancelTransaction(cancelamentoVendaParams).catch(error);
        if (cancelamentoVenda) {
            t.assert(cancelamentoVenda.status === 10, 'Status de cancelamento correto com Antifraude');
        };

        t.end();
    });
});
