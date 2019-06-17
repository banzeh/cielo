import { EnumBrands } from "../enums";

export interface ICard {
  cardNumber: string;
  holder: string;
  expirationDate: string;
  securityCode: string;
  saveCard: boolean;
  brand: EnumBrands;
  cardOnFile?: {
    usage: string,
    reason: string
  }
}
