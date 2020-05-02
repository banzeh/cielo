import { CieloTransactionInterface } from "../interface/cielo-transaction.interface";
import {
  BankSlipCreateRequestModel,
  BankSlipCreateResponseModel
} from "../models/bank-slip";
import { Utils, IHttpRequestOptions, HttpRequestMethodEnum } from "./utils";
import camelcaseKeys from "camelcase-keys";

export class BankSlip {
  private cieloTransactionParams: CieloTransactionInterface;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
  }

  public create(request: BankSlipCreateRequestModel): Promise<BankSlipCreateResponseModel> {
    return new Promise<BankSlipCreateResponseModel>((resolve, reject) => {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/sales',
        hostname: this.cieloTransactionParams.hostnameTransacao,
      });

      util.httpRequest(options, request)
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as BankSlipCreateResponseModel);
        })
        .catch((err) => reject(err));
    });
  }
}