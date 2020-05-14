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
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/sales/${params.paymentId}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      return util.request<TransactionCreditCardResponseModel>(options, {});
  }

  public merchantOrderId(params: ConsultTransactionMerchantOrderIdRequestModel): Promise<ConsultMerchantOrderIdResponseModel> {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/sales?merchantOrderId=${params.merchantOrderId}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      return util.request<ConsultMerchantOrderIdResponseModel>(options, {});
  }

  public recurrent(params: ConsultTransactionRecurrentPaymentIdRequestModel): Promise<RecurrentPaymentConsultResponseModel> {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/RecurrentPayment/${params.recurrentPaymentId}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      return util.request<RecurrentPaymentConsultResponseModel>(options, {});
  }

  public bin(params: ConsultBinRequestModel): Promise<ConsultBinResponseModel> {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/cardBin/${params.cardBin}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      return util.request<ConsultBinResponseModel>(options, {});
  }

  public cardtoken(params: ConsultTokenRequestModel): Promise<ConsultTokenResponseModel> {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.GET,
        path: `/1/card/${params.cardToken}`,
        hostname: this.cieloTransactionParams.hostnameQuery,
      });

      return util.request<ConsultTokenResponseModel>(options, {});
  }
  
}