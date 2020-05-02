import { CustomerModel } from "../customer.model";
import { Link } from "../link-model";

export interface PaymentEletronicTransferResponse {
  url: string;
  paymentId: string;
  type: string;
  amount: number;
  currency: string;
  country: string;
  provider: string;
  extraDataCollection: any[];
  status: number;
  links: Link[];
}

export interface EletronicTransferCreateResponseModel {
  merchantOrderId: string;
  customer: CustomerModel;
  payment: PaymentEletronicTransferResponse;
}