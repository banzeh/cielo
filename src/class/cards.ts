import { TokenizeResponseModel } from '../models/card/tokenize.response.model';
import { TokenizeRequestModel } from '../models/card/tokenize.request.model';
import { HttpRequestMethodEnum, IHttpRequestOptions, Utils } from './utils';
import { CieloTransactionInterface } from './../interface/cielo-transaction.interface';
import camelcaseKeys from 'camelcase-keys';

export class Card {
  private cieloTransactionParams: CieloTransactionInterface;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
  }

  public createTokenizedCard(request: TokenizeRequestModel): Promise<TokenizeResponseModel> {
    return new Promise<TokenizeResponseModel>((resolve, reject) => {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/card',
        hostname: this.cieloTransactionParams.hostnameTransacao,
      });

      util.httpRequest(options, request)
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as TokenizeResponseModel);
        })
        .catch((err) => reject(err));
    });
  }
}