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
  private util: Utils;


  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
    this.util = new Utils(transaction);
  }

  public paymentId(params: ConsultTransactionPaymentIdRequestModel): Promise<TransactionCreditCardResponseModel> {
      const options: IHttpRequestOptions = this.util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/sales/${params.paymentId}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      return this.util.request<TransactionCreditCardResponseModel>(options, {});
  }

  public merchantOrderId(params: ConsultTransactionMerchantOrderIdRequestModel): Promise<ConsultMerchantOrderIdResponseModel> {
      const options: IHttpRequestOptions = this.util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/sales?merchantOrderId=${params.merchantOrderId}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      return this.util.request<ConsultMerchantOrderIdResponseModel>(options, {});
  }

  public recurrent(params: ConsultTransactionRecurrentPaymentIdRequestModel): Promise<RecurrentPaymentConsultResponseModel> {
      const options: IHttpRequestOptions = this.util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/RecurrentPayment/${params.recurrentPaymentId}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      return this.util.request<RecurrentPaymentConsultResponseModel>(options, {});
  }

  public bin(params: ConsultBinRequestModel): Promise<ConsultBinResponseModel> {
      const options: IHttpRequestOptions = this.util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/cardBin/${params.cardBin}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      return this.util.request<ConsultBinResponseModel>(options, {});
  }

  public cardtoken(params: ConsultTokenRequestModel): Promise<ConsultTokenResponseModel> {
      const options: IHttpRequestOptions = this.util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/card/${params.cardToken}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      return this.util.request<ConsultTokenResponseModel>(options, {});
  }
  
}