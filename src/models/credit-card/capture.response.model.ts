import { Link } from "../link-model";

export interface CaptureResponseModel {
  status: number;
  tid: string;
  proofOfSale: string;
  returnCode: string;
  returnMessage: string;
  links: Link[];
}