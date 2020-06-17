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
      return this.util.postToSales<BankSlipCreateResponseModel, BankSlipCreateRequestModel>(request);
  }
}