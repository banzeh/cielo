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
import { EnumBrands, EnumCardType } from "../src/enums";

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
    console.log('Ocorreu o seguinte erro', err)
}


brands.forEach((brand) => {
    test(`Card brand ${brand}`, async (t) => {
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
            },
        };
        const venda = await cielo.creditCard.transaction(vendaParams).catch(error);
        if (!venda) {
            return;
        }
        t.assert(venda.payment.status === 1, "Status da Venda Correto");
        t.assert(
            regexToken.test(venda.payment.paymentId),
            "venda.Payment.PaymentId valido"
        );
        t.assert(
            venda.payment.amount === vendaParams.payment.amount,
            "Valor da Transacao de Venda correto"
        );
        t.assert(
            venda.customer.name === "Comprador Teste Cielo Aa",
            "Normalizacao do nome do cliente no boleto"
        );

        const capturaParcialParams: CaptureRequestModel = {
            paymentId: venda.payment.paymentId,
            amount: 2000,
        };
        const capturaParcial = await cielo.creditCard.captureSaleTransaction(capturaParcialParams).catch(error);
        if (capturaParcial) {
            t.assert(capturaParcial.status === 2, 'Status da Captura Parcial correto');
        }

        const consultaParams: ConsultTransactionPaymentIdRequestModel = {
            paymentId: venda.payment.paymentId,
        }
        const consultaPaymentId = await cielo.consult.paymentId(consultaParams).catch(error);

        if (consultaPaymentId) {
            t.assert(consultaPaymentId.payment.status === 2 || consultaPaymentId.payment.status === 1, 'Consulta de venda correta')
            t.assert(venda.payment.tid === consultaPaymentId.payment.tid, 'Tid da Venda Correto')
            t.assert(consultaPaymentId.payment.capturedAmount === capturaParcialParams.amount, 'Valor da captura parcial correto')
        }
        
        const consultaParamsMerchantOrderId: ConsultTransactionMerchantOrderIdRequestModel = {
            merchantOrderId: 'TypescriptSDK-banzeh'
        }
        
        const consultaMerchantOrderId = await cielo.consult.merchantOrderId(consultaParamsMerchantOrderId).catch(error);
        if (consultaMerchantOrderId) {
            t.assert(consultaMerchantOrderId.payments.filter(x => x.paymentId === venda.payment.paymentId).length > 0, 'Consulta de MerchantOrderId correta')
        }


        const cancelamentoVendaParams: CancelTransactionRequestModel = {
            paymentId: venda.payment.paymentId,
            amount: venda.payment.amount,
        };
        const cancelamentoVenda = await cielo.creditCard.cancelTransaction(cancelamentoVendaParams).catch(error);
        if (cancelamentoVenda) {
            t.assert(cancelamentoVenda.status === 10, 'Status de cancelamento correto');
        };

        t.end();
    });
});
