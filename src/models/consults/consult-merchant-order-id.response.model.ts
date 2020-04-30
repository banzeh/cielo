import { ConsultPayment } from '../consult-payment.model';

export interface ConsultMerchantOrderIdResponseModel {
  reasonCode: number;
  reasonMessage: string;
  payments: ConsultPayment[];
}