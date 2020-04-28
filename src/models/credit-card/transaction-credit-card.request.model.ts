import { CustomerModel } from "../customer.model";
import { PaymentRequestModel } from "../payment.request.model";

export interface TransactionCreditCardRequestModel {
  merchantOrderId: string;
  customer: CustomerModel;
  payment: PaymentRequestModel;
}
