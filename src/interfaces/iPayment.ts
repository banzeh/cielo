import { EnumPaymentInterest } from "../enums";
import { ICard } from "./iCard";

export interface ITransaction {
  merchantOrderId: string;
}

export interface IAirLineData {
  ticketNumber: string;
}

export interface IPayment {
  type: string;
  amount: number;
  currency: string;
  country: string;
  provider?: string;
  serviceTaxAmount?: number;
  softDescriptor?: string;
  installments: string;
  interest?: EnumPaymentInterest;
  capture: boolean;
  authenticate: boolean;
  creditCard: ICard;
  isCryptoCurrencyNegotiation?: boolean;
  airlineData?: IAirLineData;
}
