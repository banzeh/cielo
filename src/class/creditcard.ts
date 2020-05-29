import { CancelTransactionResponseModel } from './../models/credit-card/cancel-transaction.response.model';
import { Utils, IHttpRequestOptions, HttpRequestMethodEnum } from './utils';
import { CieloTransactionInterface } from "../interface/cielo-transaction.interface";
import {
  TransactionCreditCardRequestModel,
  TransactionCreditCardResponseModel,
  CaptureRequestModel,
  CaptureResponseModel,
  CancelTransactionRequestModel
} from '../models/credit-card';

export class CreditCard {
  private cieloTransactionParams: CieloTransactionInterface;
  private util: Utils;

  constructor(cieloTransactionParams: CieloTransactionInterface) {
    this.cieloTransactionParams = cieloTransactionParams;
    this.util = new Utils(cieloTransactionParams);
  }

  public transaction(transaction: TransactionCreditCardRequestModel): Promise<TransactionCreditCardResponseModel> {
        return this.util.postToSales<TransactionCreditCardResponseModel, TransactionCreditCardRequestModel>(transaction);
  }

  public captureSaleTransaction(transaction: CaptureRequestModel): Promise<CaptureResponseModel> {
      const options: IHttpRequestOptions = this.util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.PUT,
        path: `/1/sales/${transaction.paymentId}/capture`,
        hostname: this.cieloTransactionParams.hostnameTransacao,
      });

      if (transaction.amount && transaction.amount > 0) {
        options.path = `${options.path}?amount=${transaction.amount}`;
      }

      return this.util.request<CaptureResponseModel>(options, {});
  }

  public cancelTransaction(cancelTransactionRequest: CancelTransactionRequestModel): Promise<CancelTransactionResponseModel> {
      // Caso seja passado o valor do cancelamento, adiciona na url
      const amount = (cancelTransactionRequest.amount) ? `?amount=${cancelTransactionRequest.amount}` : '';
      const path = (cancelTransactionRequest.paymentId) ? `/1/sales/${cancelTransactionRequest.paymentId}/void${amount}` : `/1/sales/OrderId/${cancelTransactionRequest.merchantOrderId}/void${amount}`
      const options: IHttpRequestOptions = this.util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.PUT,
        path: path,
        hostname: this.cieloTransactionParams.hostnameTransacao,
      });
      return this.util.request<CancelTransactionResponseModel>(options, {})
  }
}
