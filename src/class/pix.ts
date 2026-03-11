import { CieloTransactionInterface } from '../interface/cielo-transaction.interface';
import { PixCreateRequestModel, PixCreateResponseModel } from '../models/pix';
import { Utils } from './utils';

export class Pix {
  private cieloTransactionParams: CieloTransactionInterface;
  private util: Utils;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
    this.util = new Utils(this.cieloTransactionParams);
  }

  public create(request: PixCreateRequestModel): Promise<PixCreateResponseModel> {
    return this.util.postToSales<PixCreateResponseModel, PixCreateRequestModel>(request);
  }
}
