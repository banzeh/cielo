import { EnumRecurrentPaymentInterval } from "../../enums";

export interface RecurrentPaymentModel {
  authorizeNow?: boolean,
  startDate?: string,
  endDate?: string,
  interval?: EnumRecurrentPaymentInterval
  [x: string]: any;
}