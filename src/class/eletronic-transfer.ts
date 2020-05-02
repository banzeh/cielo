import { Utils, IHttpRequestOptions, HttpRequestMethodEnum } from './utils';
import camelcaseKeys from 'camelcase-keys';
import { CieloTransactionInterface } from '../interface/cielo-transaction.interface';
import { EletronicTransferCreateResponseModel, EletronicTransferCreateRequestModel } from '../models/eletronic-transfer';

export class EletronicTransfer {
  private cieloTransactionParams: CieloTransactionInterface;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
  }

  public create(request: EletronicTransferCreateRequestModel): Promise<EletronicTransferCreateResponseModel> {
    return new Promise<EletronicTransferCreateResponseModel>((resolve, reject) => {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/sales',
        hostname: this.cieloTransactionParams.hostnameTransacao,
      });

      util.httpRequest(options, request)
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as EletronicTransferCreateResponseModel);
        })
        .catch((err) => reject(err));
    });
  }
}