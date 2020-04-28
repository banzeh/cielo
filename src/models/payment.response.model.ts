import { Link } from './link-model';
import { AirlineDataModel } from './airline-data.model';
import { CreditCardModel } from './credit-card.model';

export interface PaymentResponseModel {
  ServiceTaxAmount: number;
  Installments: number;
  Interest: string;
  Capture: boolean;
  Authenticate: boolean;
  CreditCard: CreditCardModel;
  IsCryptoCurrencyNegotiation: boolean;
  tryautomaticcancellation: boolean;
  ProofOfSale: string;
  Tid: string;
  AuthorizationCode: string;
  SoftDescriptor: string;
  PaymentId: string;
  Type: string;
  Amount: number;
  CapturedAmount: number;
  Country: string;
  AirlineData: AirlineDataModel;
  ExtraDataCollection: any[];
  Status: number;
  ReturnCode: string;
  ReturnMessage: string;
  Links: Link[];
}