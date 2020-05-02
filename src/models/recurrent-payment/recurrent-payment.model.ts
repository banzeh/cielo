import { EnumRecurrentPaymentInterval } from "../../enums";

export interface RecurrentPaymentModel {
  authorizeNow: boolean,
  endDate: string,
  interval: EnumRecurrentPaymentInterval
}