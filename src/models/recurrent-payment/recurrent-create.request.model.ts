import { RecurrentPaymentModel } from './recurrent-payment.model';
import { CustomerModel } from "../customer.model";
import { PaymentRequestModel } from '../payment.request.model';

export interface RecurrentCreateModel {
  merchantOrderId: string;
  customer: CustomerModel;
  payment: PaymentRequestModel;
}