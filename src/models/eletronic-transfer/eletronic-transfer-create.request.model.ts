import { AddressModel } from './../address.model';

export interface CustomerEletronicTransferRequest {
    name: string;
    identity: string;
    identityType: string;
    email: string;
    address: AddressModel;
    [x: string]: any;
}

export interface PaymentEletronicTransferRequest {
    provider: string;
    type: string;
    amount: number;
    returnUrl: string;
    [x: string]: any;
}

export interface EletronicTransferCreateRequestModel {
    merchantOrderId: string;
    customer: CustomerEletronicTransferRequest;
    payment: PaymentEletronicTransferRequest;
    [x: string]: any;
}

