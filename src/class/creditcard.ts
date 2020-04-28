import { Utils, IHttpRequestOptions, HttpRequestMethodEnum } from './utils';
import { TransactionCreditCardResponseModel } from "../models/credit-card/transaction-credit-card.response.model";
import { TransactionCreditCardRequestModel } from "../models/credit-card/transaction-credit-card.request.model";
import { CieloTransactionInterface } from '../interface/cielo-transaction.interface';

export class CreditCard {
  private hostname: string;

  constructor(transaction: CieloTransactionInterface) {
    this.hostname = transaction.hostnameTransacao;
    console.log('CONSTRUCTOR', this.hostname, transaction);
  }

  public transaction(transaction: TransactionCreditCardRequestModel): Promise<TransactionCreditCardResponseModel> {
    return new Promise<TransactionCreditCardResponseModel>((resolve, reject) => {
      const util = new Utils();
      const options: IHttpRequestOptions = {
        method: HttpRequestMethodEnum.POST,
        path: '/1/sales',
        hostname: this.hostname,
      }

      console.log('options da REQUISIÇÃO', options, transaction);
      util.httpRequest(options, transaction)
        .then((response) => {
          console.log('SUCESSO NA REQUISICAO', response);
          return resolve(response.data as TransactionCreditCardResponseModel);
        })
        .catch((err) => {
          console.log('ERRO NA REQUISICAO', err);
          reject(err);
        });
    });
  }
}