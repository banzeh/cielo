import { PaymentResponseModel } from './../payment.response.model';
import { CustomerModel } from './../customer.model';

export interface TransactionCreditCardResponseModel {
  merchantOrderId: string;
  customer: CustomerModel;
  payment: PaymentResponseModel;
}
