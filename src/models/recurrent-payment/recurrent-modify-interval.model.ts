import { RecurrentModifyModel } from "./recurrent-modify.model";
import { EnumRecurrentPaymentUpdateInterval } from "../../enums";

export interface RecurrentModifyIntervalModel extends RecurrentModifyModel {
  interval: EnumRecurrentPaymentUpdateInterval
}