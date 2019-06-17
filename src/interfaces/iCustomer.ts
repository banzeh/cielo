import { EnumIdentityType } from "../enums";

export interface IAddress {
  street: string;
  number: string;
  complement: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
}

export interface ICustomer {
  name: string;
  status: string;
  identity: string;
  identityType: EnumIdentityType;
  email: string;
  birthdate: Date;
  address: IAddress;
  deliveryAddress: IAddress;
}
