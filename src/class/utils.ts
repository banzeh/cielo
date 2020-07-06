import { IncomingMessage } from 'http';
import { request, RequestOptions } from 'https';
import { CieloTransactionInterface } from '../interface/cielo-transaction.interface';
import camelcaseKeys from 'camelcase-keys';

export class Utils {
  private cieloConstructor: CieloTransactionInterface;

  constructor(params: CieloTransactionInterface) {
    this.cieloConstructor = params;
  }

  public get<T>(params: { path: string }): Promise<T> {
    const hostname = this.cieloConstructor.hostnameQuery;
    const { path } = params;
    const method = HttpRequestMethodEnum.GET;

    const options: IHttpRequestOptions = this.getHttpRequestOptions({
      path,
      hostname,
      method,
    });
    return this.request<T>(options, {});
  }

  public postToSales<T, U>(data: U): Promise<T> {
    return this.post<T, U>({ path: '/1/sales/' }, data);
  }

  /**
   * Realiza um post na API da Cielo 
   * @param params path do post
   * @param data payload de envio
   */
  public post<T, U>(params: { path: string }, data: U):Promise<T> {
    const { path } = params;
    const options: IHttpRequestOptions = this.getHttpRequestOptions({
      method: HttpRequestMethodEnum.POST,
      path,
      hostname: this.cieloConstructor.hostnameTransacao,
    });
    return this.request<T>(options, data);
  }

  public getHttpRequestOptions(params: { hostname: string, path: string, method: HttpRequestMethodEnum }): IHttpRequestOptions {
    return {
      method: params.method,
      path: params.path,
      hostname: params.hostname,
      port: 443,
      encoding: "utf-8",
      headers: {
        MerchantId: this.cieloConstructor.merchantId,
        MerchantKey: this.cieloConstructor.merchantKey,
        RequestId: this.cieloConstructor.requestId || "",
        "Content-Type": "application/json",
      },
    } as IHttpRequestOptions;
  }

  private parseHttpRequestError(options: IHttpRequestOptions, data: string, response: any): IHttpRequestReject {
    return {
      statusCode: response.statusCode || '',
      request: JSON.stringify(data).toString(),
      response: response
    } as IHttpRequestReject;
  }

  private parseHttpPutResponse(response: IncomingMessage): IHttpResponse {
    return {
      statusCode: response.statusCode || 0,
      statusMessage: response.statusMessage || '',
    }
  }

  public httpRequest(options: IHttpRequestOptions, data: any): Promise<IHttpResponse> {
    const dataPost = JSON.stringify(data).normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    return new Promise<IHttpResponse>((resolve, reject) => {
      if (options && options.headers)
        options.headers['Content-Length'] = Buffer.byteLength(dataPost)
      const req = request(options, (res: IncomingMessage) => {
        var chunks: string = '';
        res.on('data', (chunk: any) => chunks += chunk);
    
        res.on('end', () => {
          const response = (chunks.length > 0 && this.validateJSON(chunks)) ? JSON.parse(chunks) : '';
          if (res.statusCode && [200, 201].indexOf(res.statusCode) === -1) return reject(this.parseHttpRequestError(options, data, res));
          if (options.method === 'PUT' && chunks.length === 0) return resolve(this.parseHttpPutResponse(res));
          return resolve({
            ...this.parseHttpPutResponse(res),
            data: camelcaseKeys(response, { deep: true })
          })
        });
      });

      req.write(dataPost)
      req.on('error', (err) => reject(err))
      req.end()
    });
  }

  public request<T>(options: IHttpRequestOptions, data: any): Promise<T> {
    return  new Promise((resolve, reject) => {
      this.httpRequest(options, data)
        .then((response) => {
          const data = response.data ? response.data : {};
          resolve(data as T)
        })
        .catch(reject);
    })
  }
  
  public validateJSON(text: string): boolean {
    return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
      text.replace(/"(\\.|[^"\\])*"/g, ''))) &&
      eval('(' + text + ')');	
  }
}


export enum HttpRequestMethodEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT'
}

export interface IHttpRequestOptions extends RequestOptions {
  method: HttpRequestMethodEnum;
  path: string;
  hostname: string;
  headers: any;
  encoding: string;
  port: number;
}

export interface IHttpRequestReject {
  statusCode: string;
  request: string;
  response: IncomingMessage;
}

/**
 * Interface com dados que serão retornados em todas as requisições
 */
export interface IHttpResponse {
  statusCode: number;
  statusMessage: string;
  data?: any;
}
