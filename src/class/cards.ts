import { TokenizeResponseModel } from '../models/card/tokenize.response.model';
import { TokenizeRequestModel } from '../models/card/tokenize.request.model';
import { HttpRequestMethodEnum, IHttpRequestOptions, Utils } from './utils';
import { CieloTransactionInterface } from './../interface/cielo-transaction.interface';

export class Card {
  private cieloTransactionParams: CieloTransactionInterface;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
  }

  public createTokenizedCard(request: TokenizeRequestModel): Promise<TokenizeResponseModel> {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/card',
        hostname: this.cieloTransactionParams.hostnameTransacao,
      });

      return util.request<TokenizeResponseModel>(options, request);
  }
}