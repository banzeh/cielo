import { CieloTransactionInterface } from "../interface/cielo-transaction.interface";
import {
  BankSlipCreateRequestModel,
  BankSlipCreateResponseModel
} from "../models/bank-slip";
import { Utils, IHttpRequestOptions, HttpRequestMethodEnum } from "./utils";

export class BankSlip {
  private cieloTransactionParams: CieloTransactionInterface;
  private util: Utils;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
    this.util = new Utils(this.cieloTransactionParams)
  }

  public create(request: BankSlipCreateRequestModel): Promise<BankSlipCreateResponseModel> {
      const options: IHttpRequestOptions = this.util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/sales',
        hostname: this.cieloTransactionParams.hostnameTransacao,
      });

      return this.util.request<BankSlipCreateResponseModel>(options, request);
  }
}