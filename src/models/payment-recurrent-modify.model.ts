
export interface CreditCardRecurrentModify {
    Brand: string;
    Holder: string;
    CardNumber: string;
    ExpirationDate: string;
}

export interface PaymentRecurrentModifyModel {
    Type: string;
    Amount: string;
    Installments: number;
    Country: string;
    Currency: string;
    SoftDescriptor: string;
    CreditCard: CreditCardRecurrentModify;
}

