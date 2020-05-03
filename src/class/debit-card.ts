import { CieloTransactionInterface } from "../interface/cielo-transaction.interface";
import { DebitCardSimpleTransactionResponseModel, DebitCardSimpleTransactionRequestModel } from "../models/debit-card";
import { Utils, IHttpRequestOptions, HttpRequestMethodEnum } from "./utils";
import camelcaseKeys from "camelcase-keys";

export class DebitCard {
  private cieloTransactionParams: CieloTransactionInterface;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
  }

  public createSimpleTransaction(transaction: DebitCardSimpleTransactionRequestModel): Promise<DebitCardSimpleTransactionResponseModel> {
    return new Promise<DebitCardSimpleTransactionResponseModel>(
      (resolve, reject) => {
        const util = new Utils(this.cieloTransactionParams);
        const options: IHttpRequestOptions = util.getHttpRequestOptions({
          method: HttpRequestMethodEnum.POST,
          path: "/1/sales",
          hostname: this.cieloTransactionParams.hostnameTransacao,
        });

        util.httpRequest(options, transaction)
          .then((response) => {
            return resolve(
              camelcaseKeys(response.data, {
                deep: true,
              }) as DebitCardSimpleTransactionResponseModel
            );
          })
          .catch((err) => reject(err));
      }
    );
  }
}