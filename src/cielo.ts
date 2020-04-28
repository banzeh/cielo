import { CieloTransactionInterface } from './interface/cielo-transaction.interface';
import { CreditCard } from './class/creditcard';

export interface CieloConstructor {
  merchantId: string;
  merchantKey: string;
  debug?: boolean;
  sandbox?: boolean;
  requestId?: string;
}

export class Cielo {
  private merchantId: string;
  private merchantKey: string;
  private debug: boolean;
  private sandbox: boolean;
  private requestId?: string | null;
  private cieloTransactionInterface: CieloTransactionInterface = {
    hostnameTransacao: '',
    hostnameQuery: '',
  };
  
  public creditCard: CreditCard;
  
  constructor(constructor: CieloConstructor) {
    this.merchantId = constructor.merchantId;
    this.merchantKey = constructor.merchantKey;
    this.debug = constructor.debug || false;
    this.sandbox = constructor.sandbox || false;
    this.requestId = constructor.requestId || null;

    if (this.sandbox) {
      this.cieloTransactionInterface.hostnameTransacao = 'apisandbox.cieloecommerce.cielo.com.br';
      this.cieloTransactionInterface.hostnameQuery = 'apiquerysandbox.cieloecommerce.cielo.com.br';
    } else {
      this.cieloTransactionInterface.hostnameTransacao = 'api.cieloecommerce.cielo.com.br';
      this.cieloTransactionInterface.hostnameQuery = 'apiquery.cieloecommerce.cielo.com.br';
    }

    this.creditCard = new CreditCard(this.cieloTransactionInterface);
  }


}
