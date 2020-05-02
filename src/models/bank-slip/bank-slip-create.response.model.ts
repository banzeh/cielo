import { AddressModel } from './../address.model';
import { Link } from './../link-model';

  export interface CustomerBankSlipResponse {
      name: string;
      address: AddressModel;
  }

  export interface PaymentBankSlipResponse {
      instructions: string;
      expirationDate: string;
      url: string;
      number: string;
      barCodeNumber: string;
      digitableLine: string;
      assignor: string;
      address: string;
      identification: string;
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

  export interface BankSlipCreateResponseModel {
      merchantOrderId: string;
      customer: CustomerBankSlipResponse;
      payment: PaymentBankSlipResponse;
  }


