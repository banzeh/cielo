import { CieloTransactionInterface } from "../interface/cielo-transaction.interface";
import { DebitCardSimpleTransactionResponseModel, DebitCardSimpleTransactionRequestModel } from "../models/debit-card";
import { Utils, IHttpRequestOptions, HttpRequestMethodEnum } from "./utils";

export class DebitCard {
  private cieloTransactionParams: CieloTransactionInterface;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
  }

  public createSimpleTransaction(transaction: DebitCardSimpleTransactionRequestModel): Promise<DebitCardSimpleTransactionResponseModel> {
        const util = new Utils(this.cieloTransactionParams);
        const options: IHttpRequestOptions = util.getHttpRequestOptions({
          method: HttpRequestMethodEnum.POST,
          path: "/1/sales",
          hostname: this.cieloTransactionParams.hostnameTransacao,
        });
        return util.request<DebitCardSimpleTransactionResponseModel>(options, transaction);
  }
}