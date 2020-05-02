import { ConsultBinResponseModel } from './../models/consults/consult-bin.response.model';
import { ConsultBinRequestModel } from './../models/consults/consult-bin.request.model';
import { RecurrentPaymentResponseModel } from './../models/recurrent-payment/recurrent-payment.response.model';
import { IHttpRequestOptions, Utils, HttpRequestMethodEnum } from './utils';
import { TransactionCreditCardResponseModel } from './../models/credit-card/transaction-credit-card.response.model';
import { ConsultTransactionPaymentIdRequestModel, ConsultTransactionMerchantOrderIdRequestModel, ConsultTransactionRecurrentPaymentIdRequestModel } from './../models/consults/consult-transaction.request.model';
import { CieloTransactionInterface } from "../interface/cielo-transaction.interface";
import camelcaseKeys from 'camelcase-keys';
import { ConsultMerchantOrderIdResponseModel } from '../models/consults';

export class Consult {
  private cieloTransactionParams: CieloTransactionInterface;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
  }

  public paymentId(params: ConsultTransactionPaymentIdRequestModel): Promise<TransactionCreditCardResponseModel> {
    return new Promise<TransactionCreditCardResponseModel>((resolve, reject) => {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/sales/${params.paymentId}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      util.httpRequest(options, {})
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as TransactionCreditCardResponseModel);
        })
        .catch((err) => reject(err));
    });
  }

  public merchantOrderId(params: ConsultTransactionMerchantOrderIdRequestModel): Promise<ConsultMerchantOrderIdResponseModel> {
    return new Promise<ConsultMerchantOrderIdResponseModel>((resolve, reject) => {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/sales?merchantOrderId=${params.merchantOrderId}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      util.httpRequest(options, {})
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as ConsultMerchantOrderIdResponseModel);
        })
        .catch((err) => reject(err));
    });
  }

  public recurrent(params: ConsultTransactionRecurrentPaymentIdRequestModel): Promise<RecurrentPaymentResponseModel> {
    return new Promise<RecurrentPaymentResponseModel>((resolve, reject) => {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/RecurrentPayment/${params.recurrentPaymentId}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      util.httpRequest(options, {})
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as RecurrentPaymentResponseModel);
        })
        .catch((err) => reject(err));
    });
  }

  public bin(params: ConsultBinRequestModel): Promise<ConsultBinResponseModel> {
    return new Promise<ConsultBinResponseModel>((resolve, reject) => {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/cardBin/${params.cardBin}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      util.httpRequest(options, {})
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as ConsultBinResponseModel);
        })
        .catch((err) => reject(err));
    });
  }
  
}