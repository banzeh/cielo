import { CieloTransactionInterface } from "../interface/cielo-transaction.interface";
import {
  BankSlipCreateRequestModel,
  BankSlipCreateResponseModel
} from "../models/bank-slip";
import { Utils, IHttpRequestOptions, HttpRequestMethodEnum } from "./utils";

export class BankSlip {
  private cieloTransactionParams: CieloTransactionInterface;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
  }

  public create(request: BankSlipCreateRequestModel): Promise<BankSlipCreateResponseModel> {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/sales',
        hostname: this.cieloTransactionParams.hostnameTransacao,
      });

      return util.request<BankSlipCreateResponseModel>(options, request);
  }
}