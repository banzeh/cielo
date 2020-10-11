export interface CancelTransactionRequestModel {
  paymentId?: string;
  merchantOrderId?: string;
  amount?: number;
  [x: string]: any;
}