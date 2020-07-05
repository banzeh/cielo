import { CustomerModel } from './../customer.model';
import { EnumCardType, EnumBrands } from "../../enums";

export interface SimpleTransactionRequestDebitCard {
    cardNumber: string;
    holder?: string;
    expirationDate: string;
    securityCode?: string;
    brand: EnumBrands;
    [x: string]: any;
}

export interface SimpleTransactionRequestPayment {
    type: EnumCardType;
    authenticate?: boolean;
    amount: number;
    returnUrl: string;
    debitCard: SimpleTransactionRequestDebitCard;
    isCryptoCurrencyNegotiation?: boolean;
    provider: string;
    [x: string]: any;
}

export interface DebitCardSimpleTransactionRequestModel {
    merchantOrderId: string;
    customer?: CustomerModel;
    payment: SimpleTransactionRequestPayment;
    [x: string]: any;
}