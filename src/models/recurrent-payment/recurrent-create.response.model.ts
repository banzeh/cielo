import { CreditCardModel } from '../credit-card.model';
import { Link } from '../link-model';

export interface Customer {
  name: string;
}

export interface RecurrentPayment {
  recurrentPaymentId: string;
  nextRecurrency: string;
  endDate: string;
  interval: number;
  link: Link;
  authorizeNow: boolean;
  reasonCode: number;
}

export interface Payment {
  serviceTaxAmount: number;
  installments: number;
  interest: string;
  capture: boolean;
  authenticate: boolean;
  recurrent: boolean;
  creditCard: CreditCardModel;
  proofOfSale: string;
  tid: string;
  authorizationCode: string;
  softDescriptor: string;
  paymentId: string;
  type: string;
  amount: number;
  currency: string;
  country: string;
  extraDataCollection: any[];
  status: number;
  returnCode: string;
  returnMessage: string;
  link: Link;
  authorizeNow: boolean;
  recurrentPayment: RecurrentPayment;
}

export interface RecurrentCreateResponse {
  merchantOrderId: string;
  customer: Customer;
  payment: Payment;
  links?: Link[];
}
