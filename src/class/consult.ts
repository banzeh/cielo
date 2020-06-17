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
      const options = {
        path: `/1/sales/${params.paymentId}`,
      };

      return this.util.get<TransactionCreditCardResponseModel>(options);
  }

  public merchantOrderId(params: ConsultTransactionMerchantOrderIdRequestModel): Promise<ConsultMerchantOrderIdResponseModel> {
      const options = {
        path: `/1/sales?merchantOrderId=${params.merchantOrderId}`,
      };

      return this.util.get<ConsultMerchantOrderIdResponseModel>(options);
  }

  public recurrent(params: ConsultTransactionRecurrentPaymentIdRequestModel): Promise<RecurrentPaymentConsultResponseModel> {
      const options = {
        path: `/1/RecurrentPayment/${params.recurrentPaymentId}`,
      };

      return this.util.get<RecurrentPaymentConsultResponseModel>(options);
  }

  public bin(params: ConsultBinRequestModel): Promise<ConsultBinResponseModel> {
      const options = {
        path: `/1/cardBin/${params.cardBin}`,
      };

      return this.util.get<ConsultBinResponseModel>(options);
  }

  public cardtoken(params: ConsultTokenRequestModel): Promise<ConsultTokenResponseModel> {
      const options = {
        path: `/1/card/${params.cardToken}`,
      };

      return this.util.get<ConsultTokenResponseModel>(options);
  }
  
}