import { Cielo, CieloConstructor } from './../src/cielo';
import test from "tape";
import { EnumCardType, EnumBrands } from '../src/enums';
import { DebitCardSimpleTransactionRequestModel } from '../src';

function error(err: Object) {
  console.log('Ocorreu o seguinte erro', err)
}

const regexToken = new RegExp(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/);

const cieloParams: CieloConstructor = {
  merchantId: "dbe5e423-ed15-4c27-843a-fedf325ea67c",
  merchantKey: "NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD",
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

test('Cartao de debito', async (t) => {
  const debitCardTransactionParams: DebitCardSimpleTransactionRequestModel = {  
    merchantOrderId: "2014121201",
    customer:{  
      name: "Paulo Henrique"     
    },
    payment: {  
      type: EnumCardType.DEBIT,
      amount: 15700,
      provider: "Simulado",
      returnUrl: "http://www.google.com.br",
      debitCard:{  
          cardNumber: "4532117080573703",
          holder: "Teste Holder",
          expirationDate: "12/2022",
          securityCode: "023",
          brand: EnumBrands.VISA
      }
    }
 }

  const debitCardTransaction = await cielo.debitCard.createSimpleTransaction(debitCardTransactionParams).catch(error);
  if (!debitCardTransaction) {
    t.end('Erro ao criar a transação com cartão de débito');
    return;
  }
  t.assert(debitCardTransaction.payment.status === 0, "Status da Venda Correto");
  t.assert(
      regexToken.test(debitCardTransaction.payment.paymentId),
      "debitCardTransaction.Payment.PaymentId valido"
  );
  t.assert(
      debitCardTransaction.payment.amount === debitCardTransactionParams.payment.amount,
      "Valor da Transacao de Venda correto"
  );

  t.end();
})
