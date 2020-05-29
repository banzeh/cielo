import { Utils, IHttpRequestOptions, HttpRequestMethodEnum } from './utils';
import { CieloTransactionInterface } from '../interface/cielo-transaction.interface';
import { EletronicTransferCreateResponseModel, EletronicTransferCreateRequestModel } from '../models/eletronic-transfer';

export class EletronicTransfer {
  private cieloTransactionParams: CieloTransactionInterface;
  private util: Utils;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
    this.util = new Utils(this.cieloTransactionParams)
  }

  public create(request: EletronicTransferCreateRequestModel): Promise<EletronicTransferCreateResponseModel> {
      return this.util.postToSales<EletronicTransferCreateResponseModel, EletronicTransferCreateRequestModel>(request);
  }
}