import { CieloTransactionInterface } from "../interface/cielo-transaction.interface";
import { IHttpResponse, Utils, IHttpRequestOptions, HttpRequestMethodEnum } from "./utils";
import {
  RecurrentModifyCustomerModel,
  RecurrentCreateModel,
  RecurrentModifyEndDateModel, 
  RecurrentModifyIntervalModel,
  RecurrentModifyDayModel,
  RecurrentModifyAmountModel,
  RecurrentModifyNextPaymentDateModel,
  RecurrentModifyModel,
  RecurrentCreateResponse
} from "../models/recurrent-payment";
import camelcaseKeys from "camelcase-keys";
import { CustomerModel, PaymentRequestModel, PaymentRecurrentModifyModel } from "../models";
import { RecurrentModifyPaymentModel } from "../models/recurrent-payment/recurrent-modify-payment.model";

export class Recurrent {
  private cieloTransactionParams: CieloTransactionInterface;

  constructor(transaction: CieloTransactionInterface) {
    this.cieloTransactionParams = transaction;
  }

  public create(params: RecurrentCreateModel): Promise<RecurrentCreateResponse> {
    return new Promise<RecurrentCreateResponse>((resolve, reject) => {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.POST,
        path: '/1/sales/',
        hostname: this.cieloTransactionParams.hostnameTransacao,
      });

      util.httpRequest(options, params)
        .then((response) => resolve(camelcaseKeys(response.data, {deep: true,}) as RecurrentCreateResponse))
        .catch((err) => reject(err));
    });
  }

  public modifyCustomer(params: RecurrentModifyCustomerModel): Promise<IHttpResponse> {
    const modifyParams = {
      path: `/1/RecurrentPayment/${params.paymentId}/Customer`,
      data: params.customer
    };
    return this.modify(modifyParams);
  };

  public modifyEndDate(params: RecurrentModifyEndDateModel): Promise<IHttpResponse> {
    const modifyParams = {
      path: `/1/RecurrentPayment/${params.paymentId}/EndDate`,
      data: params.endDate
    };
    return this.modify(modifyParams);
  };

  public modifyInterval(params: RecurrentModifyIntervalModel): Promise<IHttpResponse> {
    const modifyParams = {
      path: `/1/RecurrentPayment/${params.paymentId}/Interval`,
      data: params.interval
    };
    return this.modify(modifyParams);
  };

  public modifyRecurrencyDay(params: RecurrentModifyDayModel): Promise<IHttpResponse> {
    const modifyParams = {
      path: `/1/RecurrentPayment/${params.paymentId}/RecurrencyDay`,
      data: params.recurrencyDay
    };
    return this.modify(modifyParams);
  };

  public modifyAmount(params: RecurrentModifyAmountModel): Promise<IHttpResponse> {
    const modifyParams = {
      path: `/1/RecurrentPayment/${params.paymentId}/Amount`,
      data: (params.amount * 100).toString()
    };
    return this.modify(modifyParams);
  };

  public modifyNextPaymentDate(params: RecurrentModifyNextPaymentDateModel): Promise<IHttpResponse> {
    const modifyParams = {
      path: `/1/RecurrentPayment/${params.paymentId}/NextPaymentDate`,
      data: params.nextPaymentDate
    };
    return this.modify(modifyParams);
  };

  public modifyPayment(params: RecurrentModifyPaymentModel): Promise<IHttpResponse> {
    const modifyParams = {
      path: `/1/RecurrentPayment/${params.paymentId}/Payment`,
      data: params.payment
    };
    return this.modify(modifyParams);
  };

  public deactivate(params: RecurrentModifyModel): Promise<IHttpResponse> {
    const modifyParams = {
      path: `/1/RecurrentPayment/${params.paymentId}/Deactivate`,
      data: ''
    };
    return this.modify(modifyParams);
  };

  public reactivate(params: RecurrentModifyModel): Promise<IHttpResponse> {
    const modifyParams = {
      path: `/1/RecurrentPayment/${params.paymentId}/Reactivate`,
      data: ''
    };
    return this.modify(modifyParams);
  };

  private modify(params: {path: string, data: string | CustomerModel | PaymentRecurrentModifyModel | number}): Promise<IHttpResponse> {
    return new Promise<IHttpResponse>((resolve, reject) => {
      const util = new Utils(this.cieloTransactionParams);
      const options: IHttpRequestOptions = util.getHttpRequestOptions({
        method: HttpRequestMethodEnum.PUT,
        path: params.path,
        hostname: this.cieloTransactionParams.hostnameTransacao,
      });

      util.httpRequest(options, params.data)
        .then((response) => {
          return resolve(
            camelcaseKeys(response, {
              deep: true,
            }) as IHttpResponse
          );
        })
        .catch((err) => reject(err));
    });
  }

}