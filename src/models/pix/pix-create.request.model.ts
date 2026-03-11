import { CustomerModel } from '../customer.model';

export interface PaymentPixRequest {
  type: string;
  amount: number;
  qrCodeExpiration?: number;
  additionalData?: PixAdditionalData[];
  [x: string]: any;
}

export interface PixAdditionalData {
  name: string;
  value: string;
}

export interface PixCreateRequestModel {
  merchantOrderId: string;
  customer: CustomerModel;
  payment: PaymentPixRequest;
  [x: string]: any;
}
