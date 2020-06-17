import { CieloTransactionInterface } from "../interface/cielo-transaction.interface";
import { DebitCardSimpleTransactionResponseModel, DebitCardSimpleTransactionRequestModel } from "../models/debit-card";
import { Utils, IHttpRequestOptions, HttpRequestMethodEnum } from "./utils";

export class DebitCard {
  private cieloTransactionParams: CieloTransactionInterface;
  private util: Utils;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
    this.util = new Utils(this.cieloTransactionParams)
  }

  public createSimpleTransaction(transaction: DebitCardSimpleTransactionRequestModel): Promise<DebitCardSimpleTransactionResponseModel> {
        return this.util.postToSales<DebitCardSimpleTransactionResponseModel, DebitCardSimpleTransactionRequestModel>(transaction);
  }
}