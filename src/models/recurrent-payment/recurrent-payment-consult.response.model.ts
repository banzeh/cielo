import { RecurrentConsultRecurrentPaymentConsultResponseModel } from './recurrent-consult-recurrent-payment-consult.response.model';
import { CustomerModel } from "../customer.model";

export interface RecurrentPaymentConsultResponseModel {
  customer: CustomerModel;
  recurrentPayment: RecurrentConsultRecurrentPaymentConsultResponseModel;
}