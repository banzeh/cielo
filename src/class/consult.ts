import camelcaseKeys from 'camelcase-keys';
import { CieloTransactionInterface } from "../interface/cielo-transaction.interface";
import { ConsultMerchantOrderIdResponseModel } from '../models/consults';
import { ConsultBinRequestModel } from './../models/consults/consult-bin.request.model';
import { ConsultBinResponseModel } from './../models/consults/consult-bin.response.model';
import { ConsultTransactionMerchantOrderIdRequestModel, ConsultTransactionPaymentIdRequestModel, ConsultTransactionRecurrentPaymentIdRequestModel } from './../models/consults/consult-transaction.request.model';
import { TransactionCreditCardResponseModel } from './../models/credit-card/transaction-credit-card.response.model';
import { RecurrentPaymentResponseModel } from './../models/recurrent-payment/recurrent-payment.response.model';
import { HttpRequestMethodEnum, IHttpRequestOptions, Utils } from './utils';

export class Consult {
  private cieloTransactionParams: CieloTransactionInterface;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
  }

  public paymentId(params: ConsultTransactionPaymentIdRequestModel): Promise<TransactionCreditCardResponseModel> {
    return new Promise<TransactionCreditCardResponseModel>((resolve, reject) => {
      const util = new Utils();
      const options: IHttpRequestOptions = {
        method: HttpRequestMethodEnum.GET,
        path: `/1/sales/${params.paymentId}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
        port: 443,
        encoding: 'utf-8',
        headers: {
          'MerchantId': this.cieloTransactionParams.merchantId,
          'MerchantKey': this.cieloTransactionParams.merchantKey,
          'RequestId': this.cieloTransactionParams.requestId || '',
          'Content-Type': 'application/json'
        }
      }

      util.httpRequest(options, {})
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as TransactionCreditCardResponseModel);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  public merchantOrderId(params: ConsultTransactionMerchantOrderIdRequestModel): Promise<ConsultMerchantOrderIdResponseModel> {
    return new Promise<ConsultMerchantOrderIdResponseModel>((resolve, reject) => {
      const util = new Utils();
      const options: IHttpRequestOptions = {
        method: HttpRequestMethodEnum.GET,
        path: `/1/sales?merchantOrderId=${params.merchantOrderId}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
        port: 443,
        encoding: 'utf-8',
        headers: {
          'MerchantId': this.cieloTransactionParams.merchantId,
          'MerchantKey': this.cieloTransactionParams.merchantKey,
          'RequestId': this.cieloTransactionParams.requestId || '',
          'Content-Type': 'application/json'
        }
      }

      util.httpRequest(options, {})
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as ConsultMerchantOrderIdResponseModel);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  public recurrent(params: ConsultTransactionRecurrentPaymentIdRequestModel): Promise<RecurrentPaymentResponseModel> {
    return new Promise<RecurrentPaymentResponseModel>((resolve, reject) => {
      const util = new Utils();
      const options: IHttpRequestOptions = {
        method: HttpRequestMethodEnum.GET,
        path: `/1/RecurrentPayment/${params.recurrentPaymentId}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
        port: 443,
        encoding: 'utf-8',
        headers: {
          'MerchantId': this.cieloTransactionParams.merchantId,
          'MerchantKey': this.cieloTransactionParams.merchantKey,
          'RequestId': this.cieloTransactionParams.requestId || '',
          'Content-Type': 'application/json'
        }
      }

      util.httpRequest(options, {})
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as RecurrentPaymentResponseModel);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  public bin(params: ConsultBinRequestModel): Promise<ConsultBinResponseModel> {
    return new Promise<ConsultBinResponseModel>((resolve, reject) => {
      const util = new Utils();
      const options: IHttpRequestOptions = {
        method: HttpRequestMethodEnum.GET,
        path: `/1/cardBin/${params.cardBin}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
        port: 443,
        encoding: 'utf-8',
        headers: {
          'MerchantId': this.cieloTransactionParams.merchantId,
          'MerchantKey': this.cieloTransactionParams.merchantKey,
          'RequestId': this.cieloTransactionParams.requestId || '',
          'Content-Type': 'application/json'
        }
      }

      util.httpRequest(options, {})
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as ConsultBinResponseModel);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
  
}