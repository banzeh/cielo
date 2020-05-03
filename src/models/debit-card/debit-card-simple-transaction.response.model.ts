import { Link } from '../link-model';

export interface CustomerSimpleTransactionResponse {
  name: string;
}

export interface DebitCardSimpleTransactionResponse {
  cardNumber: string;
  holder: string;
  expirationDate: string;
  saveCard: boolean;
  brand: string;
}

export interface PaymentSimpleTransactionResponse {
  debitCard: DebitCardSimpleTransactionResponse;
  isCryptoCurrencyNegotiation: boolean;
  authenticationUrl: string;
  tid: string;
  paymentId: string;
  type: string;
  amount: number;
  currency: string;
  country: string;
  extraDataCollection: any[];
  status: number;
  returnCode: string;
  links: Link[];
}

export interface DebitCardSimpleTransactionResponseModel {
  merchantOrderId: string;
  customer: CustomerSimpleTransactionResponse;
  payment: PaymentSimpleTransactionResponse;
}