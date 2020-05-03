import { AddressModel } from './../address.model';

export interface CustomerEletronicTransferRequest {
    name: string;
    identity: string;
    identityType: string;
    email: string;
    address: AddressModel;
}

export interface PaymentEletronicTransferRequest {
    provider: string;
    type: string;
    amount: number;
    returnUrl: string;
}

export interface EletronicTransferCreateRequestModel {
    merchantOrderId: string;
    customer: CustomerEletronicTransferRequest;
    payment: PaymentEletronicTransferRequest;
}

