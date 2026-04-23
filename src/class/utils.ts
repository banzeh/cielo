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

  private parseHttpRequestError(
    _options: IHttpRequestOptions,
    data: string,
    responseHttp: IncomingMessage & { Code?: string; Message?: string },
    responseCielo: CieloErrorResponse[] | unknown
  ): IHttpRequestReject {
    const firstError = Array.isArray(responseCielo) ? responseCielo[0] : undefined;
    responseHttp.Code = (firstError && firstError.Code !== undefined ? String(firstError.Code) : '') || '';
    responseHttp.Message = (firstError && firstError.Message) || '';
    return {
      statusCode: responseHttp.statusCode || '',
      request: JSON.stringify(data).toString(),
      response: responseHttp
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
        let chunks: string = '';
        res.on('data', (chunk: any) => chunks += chunk);
    
        res.on('end', () => {
          const response = (chunks.length > 0 && this.validateJSON(chunks)) ? JSON.parse(chunks) : '';
          if (res.statusCode && [200, 201].indexOf(res.statusCode) === -1) return reject(this.parseHttpRequestError(options, data, res, response));
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
    return this.httpRequest(options, data)
      .then((response) => (response.data ? response.data : {}) as T);
  }

  public validateJSON(text: string): boolean {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
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
  headers: Record<string, string | number>;
  encoding: string;
  port: number;
}

export interface CieloErrorResponse {
  Code?: string | number;
  Message?: string;
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
  data?: Record<string, unknown>;
}
