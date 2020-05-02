import { RecurrentModifyModel } from "./recurrent-modify.model";
import { PaymentRecurrentModifyModel } from "../payment-recurrent-modify.model";

export interface RecurrentModifyPaymentModel extends RecurrentModifyModel {
  payment: PaymentRecurrentModifyModel;
}