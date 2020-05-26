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
      const options: IHttpRequestOptions = this.util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/sales',
        hostname: this.cieloTransactionParams.hostnameTransacao,
      });

      return this.util.request<EletronicTransferCreateResponseModel>(options, request);
  }
}