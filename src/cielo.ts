import { EletronicTransfer } from './class/eletronic-transfer';
import { BankSlip } from './class/bank-slip';
import { Recurrent } from './class/recurrent';
import { Consult } from './class/consult';
import { Card } from './class/cards';
import { CieloTransactionInterface } from './interface/cielo-transaction.interface';
import { CreditCard } from './class/creditcard';
import { DebitCard } from './class/debit-card';

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
  public debitCard: DebitCard;

  public card: Card;
  public cartao: Card = this.card;

  public consult: Consult;
  public consulta: Consult;

  public recurrent: Recurrent;
  public recorrencia: Recurrent;

  public bankSlip: BankSlip;
  public boleto: BankSlip;

  public eletronicTransfer: EletronicTransfer;
  public transferenciaEletronica: EletronicTransfer;
  
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
    this.debitCard = new DebitCard(cieloTransactionInterface);
    this.card = new Card(cieloTransactionInterface);
    this.consult = new Consult(cieloTransactionInterface);
    this.recurrent = new Recurrent(cieloTransactionInterface);
    this.bankSlip = new BankSlip(cieloTransactionInterface);
    this.eletronicTransfer = new EletronicTransfer(cieloTransactionInterface);

    this.consulta = this.consult;
    this.recorrencia = this.recurrent;
    this.boleto = this.bankSlip;
    this.transferenciaEletronica = this.eletronicTransfer;
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
