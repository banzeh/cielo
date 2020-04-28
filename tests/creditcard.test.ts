import { CaptureRequestModel } from './../src/models/credit-card/capture.request.model';
import { TokenizeRequestModel } from '../src/models/card/tokenize.request.model';
import test from "tape";
import {
    Cielo,
    CieloConstructor,
    TransactionCreditCardRequestModel,
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

brands.forEach((brand) => {
    test(`Card brand ${brand}`, async (t) => {          
        const vendaParams: TransactionCreditCardRequestModel = {
            customer: {
                name: "Comprádor Teste Cíéló Áá",
            },
            merchantOrderId: "123",
            payment: {
                amount: 1000,
                creditCard: {
                    brand: EnumBrands.VISA,
                    cardNumber: "4532117080573700",
                    holder: "Comprador T Cielo",
                    expirationDate: "12/2021",
                },
                installments: 1,
                softDescriptor: "Banzeh",
                type: EnumCardType.CREDIT,
            },
        };
        const venda = await cielo.creditCard.transaction(vendaParams);
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

        const captureParams: CaptureRequestModel = {
            paymentId: venda.payment.paymentId
        };
        const captura = await cielo.creditCard.captureSaleTransaction(captureParams);
        t.assert(captura.status === 2, 'Status da Captura correto')

        t.end();
    });
});
