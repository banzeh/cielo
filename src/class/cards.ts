import { TokenizeResponseModel } from '../models/card/tokenize.response.model';
import { TokenizeRequestModel } from '../models/card/tokenize.request.model';
import { HttpRequestMethodEnum, IHttpRequestOptions, Utils } from './utils';
import { CieloTransactionInterface } from './../interface/cielo-transaction.interface';

export class Card {
  private cieloTransactionParams: CieloTransactionInterface;
  private util: Utils;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
    this.util = new Utils(this.cieloTransactionParams);
  }

  public createTokenizedCard(request: TokenizeRequestModel): Promise<TokenizeResponseModel> {
      const options: IHttpRequestOptions = this.util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/card',
        hostname: this.cieloTransactionParams.hostnameTransacao,
      });
      return this.util.request<TokenizeResponseModel>(options, request);
  }
}