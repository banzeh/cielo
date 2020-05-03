import camelcaseKeys from 'camelcase-keys';
import { CieloTransactionInterface } from "../interface/cielo-transaction.interface";
import {
  ConsultMerchantOrderIdResponseModel,
  ConsultBinResponseModel,
  ConsultBinRequestModel,
  ConsultTransactionMerchantOrderIdRequestModel,
  ConsultTransactionPaymentIdRequestModel,
  ConsultTransactionRecurrentPaymentIdRequestModel,
  ConsultTokenRequestModel,
  ConsultTokenResponseModel
} from '../models/consults';
import { TransactionCreditCardResponseModel } from './../models/credit-card/transaction-credit-card.response.model';
import { HttpRequestMethodEnum, IHttpRequestOptions, Utils } from './utils';
import { RecurrentPaymentConsultResponseModel } from '../models/recurrent-payment';

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

  public recurrent(params: ConsultTransactionRecurrentPaymentIdRequestModel): Promise<RecurrentPaymentConsultResponseModel> {
    return new Promise<RecurrentPaymentConsultResponseModel>((resolve, reject) => {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/RecurrentPayment/${params.recurrentPaymentId}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      util.httpRequest(options, {})
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as RecurrentPaymentConsultResponseModel);
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

  public cardtoken(params: ConsultTokenRequestModel): Promise<ConsultTokenResponseModel> {
    return new Promise<ConsultTokenResponseModel>((resolve, reject) => {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/card/${params.cardToken}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      util.httpRequest(options, {})
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as ConsultTokenResponseModel);
        })
        .catch((err) => reject(err));
    });
  }
  
}