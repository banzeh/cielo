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
      return this.util.post<TokenizeResponseModel, TokenizeRequestModel>({ path: '/1/card' }, request);
  }
}