import { RecurrentModifyModel } from "./recurrent-modify.model";
import { EnumRecurrentPaymentInterval } from "../../enums";

export interface RecurrentModifyIntervalModel extends RecurrentModifyModel {
  interval: EnumRecurrentPaymentInterval
}