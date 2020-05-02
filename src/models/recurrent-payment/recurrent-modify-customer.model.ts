import { RecurrentModifyModel } from "./recurrent-modify.model";
import { CustomerModel } from "../customer.model";

export interface RecurrentModifyCustomerModel extends RecurrentModifyModel {
  customer: CustomerModel
}