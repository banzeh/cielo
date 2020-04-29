import { CustomerModel } from "../customer.model";
import { ConsultTransactionRecurrentPaymentIdRequestModel } from "../consults";

export interface RecurrentPaymentResponseModel {
  customer: CustomerModel;
  recurrentPayment: ConsultTransactionRecurrentPaymentIdRequestModel;
}