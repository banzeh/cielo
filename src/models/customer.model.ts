import { AddressModel } from './address.model';

export interface CustomerModel {
  /**
   * 	Nome do Comprador.
   */
  name?: string;
  /**
   * Status de cadastro do comprador na loja (NEW / EXISTING)
   */
  status?: string;
  /**
   * Número do RG, CPF ou CNPJ do Cliente.
   */
  identity?: string;
  /**
   * Tipo de documento de identificação do comprador (CFP/CNPJ).
   */
  identityType?: string;
  /**
   * Email do Comprador.
   */
  email?: string;
  /**
   * Data de nascimento do Comprador.
   */
  birthdate?: string;
  /**
   * Número do telefone do comprador
     Ex.: 5521976781114
  */
  phone?: string;
  /**
   * Endereço do Comprador.
   */
  address?: AddressModel;
  /**
   * Endereço de entraga.
   */
  deliveryAddress?: AddressModel;
  /**
   * Número do telefone
   */
  phone?: string;
  [x: string]: any;
}