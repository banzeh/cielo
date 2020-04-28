import test from "tape";
import { Cielo, CieloConstructor, TransactionCreditCardRequestModel} from '../src/index';
import { EnumBrands, EnumCardType } from '../src/enums';


const cieloParams: CieloConstructor = {
  merchantId: 'dbe5e423-ed15-4c27-843a-fedf325ea67c',
  merchantKey: 'NPGKHFARFASEZEPYEYLTXJMWACSWDEMJWBAKWPQD',
  sandbox: true,
};
const cielo = new Cielo(cieloParams);

test('CreditCard Transaction', async (t) => {
  const cieloCreditCardTransactionParams: TransactionCreditCardRequestModel = {
    customer: {
      name: 'Cielo API Test',
    },
    merchantOrderId: '123',
    payment: {
      amount: 1000,
      creditCard: {
        brand: EnumBrands.VISA,
        cardNumber: '4532117080573700',
        holder: 'Comprador T Cielo',
        expirationDate: '12/2021',
      },
      installments: 1,
      softDescriptor: 'Banzeh',
      type: EnumCardType.CREDIT
    }
  }
  const response = await cielo.creditCard.transaction(cieloCreditCardTransactionParams);
  console.log(response);
  t.end();
});
