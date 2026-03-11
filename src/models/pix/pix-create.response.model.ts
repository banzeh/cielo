import { CustomerModel } from '../customer.model';
import { Link } from '../link-model';

export interface PaymentPixResponse {
  qrCodeBase64Image: string;
  qrCodeString: string;
  paymentId: string;
  type: string;
  amount: number;
  receivedDate: string;
  currency: string;
  country: string;
  status: number;
  returnCode: string;
  returnMessage: string;
  links: Link[];
  [x: string]: any;
}

export interface PixCreateResponseModel {
  merchantOrderId: string;
  customer: CustomerModel;
  payment: PaymentPixResponse;
}
