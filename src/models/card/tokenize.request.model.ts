import { EnumBrands } from "../../enums";

export interface TokenizeRequestModel {
  customerName: string;
  cardNumber: string;
  holder: string;
  expirationDate: string;
  brand: EnumBrands;
}
