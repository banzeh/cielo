import { Link } from '../link-model';

export interface TokenizeResponseModel {
  cardToken: string;
  links: Link;
}