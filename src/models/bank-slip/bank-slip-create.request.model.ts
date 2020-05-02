import { CustomerModel } from "../customer.model";

export interface PaymentBankSlip {
  type: string;
  amount: number;
  provider: string;
  address: string;
  boletoNumber: string;
  assignor: string;
  demonstrative: string;
  expirationDate: string;
  identification: string;
  instructions: string;
}

export interface BankSlipCreateRequestModel {
  merchantOrderId: string;
  customer: CustomerModel;
  payment: PaymentBankSlip;
}