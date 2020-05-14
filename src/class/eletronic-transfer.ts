import { Utils, IHttpRequestOptions, HttpRequestMethodEnum } from './utils';
import { CieloTransactionInterface } from '../interface/cielo-transaction.interface';
import { EletronicTransferCreateResponseModel, EletronicTransferCreateRequestModel } from '../models/eletronic-transfer';

export class EletronicTransfer {
  private cieloTransactionParams: CieloTransactionInterface;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
  }

  public create(request: EletronicTransferCreateRequestModel): Promise<EletronicTransferCreateResponseModel> {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/sales',
        hostname: this.cieloTransactionParams.hostnameTransacao,
      });

      return util.request<EletronicTransferCreateResponseModel>(options, request);
  }
}