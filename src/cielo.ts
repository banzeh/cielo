import { BankSlip } from './class/bank-slip';
import { Recurrent } from './class/recurrent';
import { Consult } from './class/consult';
import { Card } from './class/cards';
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
  private requestId?: string | undefined;

  public creditCard: CreditCard;

  public card: Card;
  public cartao: Card = this.card;

  public consult: Consult;
  public consulta: Consult;

  public recurrent: Recurrent;
  public recorrencia: Recurrent;

  public bankSlip: BankSlip;
  public boleto: BankSlip;
  
  constructor(constructor: CieloConstructor) {
    this.merchantId = constructor.merchantId;
    this.merchantKey = constructor.merchantKey;
    this.debug = constructor.debug || false;
    this.sandbox = constructor.sandbox || false;
    this.requestId = constructor.requestId || undefined;

    const [hostnameTransacao, hostnameQuery] = this.getHostnames(this.sandbox);
    const cieloTransactionInterface: CieloTransactionInterface = {
      hostnameTransacao,
      hostnameQuery,
      merchantId: this.merchantId,
      merchantKey: this.merchantKey,
      requestId: this.requestId,
    };

    this.creditCard = new CreditCard(cieloTransactionInterface);
    this.card = new Card(cieloTransactionInterface);
    this.consult = new Consult(cieloTransactionInterface);
    this.recurrent = new Recurrent(cieloTransactionInterface);
    this.bankSlip = new BankSlip(cieloTransactionInterface);

    this.consulta = this.consult;
    this.recorrencia = this.recurrent;
    this.boleto = this.bankSlip;
  }

  private getHostnames(sandbox: boolean): Array<string> {
    if (sandbox) {
      return [
        'apisandbox.cieloecommerce.cielo.com.br',
        'apiquerysandbox.cieloecommerce.cielo.com.br'
      ]
    } else {
      return [
        'api.cieloecommerce.cielo.com.br',
        'apiquery.cieloecommerce.cielo.com.br',
      ];
    }
  }


}
