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
      const util = new Utils();
      const options: IHttpRequestOptions = {
        method: HttpRequestMethodEnum.POST,
        path: '/1/card',
        hostname: this.cieloTransactionParams.hostnameTransacao,
        port: 443,
        encoding: 'utf-8',
        headers: {
          'MerchantId': this.cieloTransactionParams.merchantId,
          'MerchantKey': this.cieloTransactionParams.merchantKey,
          'RequestId': this.cieloTransactionParams.requestId || '',
          'Content-Type': 'application/json'
        }
      }

      util.httpRequest(options, request)
        .then((response) => {
          return resolve(camelcaseKeys(response.data, {deep: true}) as TokenizeResponseModel);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
}