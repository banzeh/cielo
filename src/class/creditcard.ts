import { Utils, IHttpRequestOptions, HttpRequestMethodEnum } from './utils';
import { TransactionCreditCardResponseModel } from "../models/credit-card/transaction-credit-card.response.model";
import { TransactionCreditCardRequestModel } from "../models/credit-card/transaction-credit-card.request.model";
import { CieloTransactionInterface } from '../interface/cielo-transaction.interface';
import camelcaseKeys from 'camelcase-keys';
import { CaptureRequestModel, CaptureResponseModel } from '../models/credit-card';

export class CreditCard {
  private cieloTransactionParams: CieloTransactionInterface;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
  }

  public transaction(transaction: TransactionCreditCardRequestModel): Promise<TransactionCreditCardResponseModel> {
    return new Promise<TransactionCreditCardResponseModel>((resolve, reject) => {
      const util = new Utils();
      const options: IHttpRequestOptions = {
        method: HttpRequestMethodEnum.POST,
        path: '/1/sales',
        hostname: this.cieloTransactionParams.hostnameTransacao,
        port: 443,
        encoding: 'utf-8',
        headers: {
          'MerchantId': this.cieloTransactionParams.merchantId,
          'MerchantKey': this.cieloTransactionParams.merchantKey,
          'RequestId': this.cieloTransactionParams.requestId || '',
          'Content-Type': 'application/json'
        }
      }

      util.httpRequest(options, transaction)
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as TransactionCreditCardResponseModel);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public captureSaleTransaction(transaction: CaptureRequestModel): Promise<CaptureResponseModel> {
    return new Promise<CaptureResponseModel>((resolve, reject) => {
      const util = new Utils();
      const options: IHttpRequestOptions = {
        method: HttpRequestMethodEnum.PUT,
        path: `/1/sales/${transaction.paymentId}/capture`,
        hostname: this.cieloTransactionParams.hostnameTransacao,
        port: 443,
        encoding: 'utf-8',
        headers: {
          'MerchantId': this.cieloTransactionParams.merchantId,
          'MerchantKey': this.cieloTransactionParams.merchantKey,
          'RequestId': this.cieloTransactionParams.requestId || '',
          'Content-Type': 'application/json'
        }
      }

      util.httpRequest(options, transaction)
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as CaptureResponseModel);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}