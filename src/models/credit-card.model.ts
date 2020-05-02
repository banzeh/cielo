import { CardOnFileModel } from './card-on-file.model';
import { EnumBrands } from "../enums";

export interface CreditCardModel {
  /**
   * 	Número do Cartão do Comprador.
   */
  cardNumber?: string;
  /**
   * Token de identificação do Cartão.  
   */
  cardToken?: string;
  /**
   * Nome do Comprador impresso no cartão.
   */
  holder?: string;
  /**
   * Data de validade impresso no cartão.
   */
  expirationDate?: string;
  /**
   * Código de segurança impresso no verso do cartão - Ver Anexo.
   */
  securityCode?: string;
  /**
   * Booleano que identifica se o cartão será salvo para gerar o CardToken.
   */
  saveCard?: boolean;
  /**
   * Bandeira do cartão (Visa / Master / Amex / Elo / Aura / JCB / Diners / Discover / Hipercard / Hiper).
   */
  brand: EnumBrands;
  /**
   * 
   */
  cardOnFile?: CardOnFileModel;
  /**
   * O PAR(payment account reference) é o número que associa diferentes tokens a um mesmo cartão.
   * Será retornado pelas bandeiras Master e Visa e repassado para os clientes do e-commerce Cielo.
   * Caso a bandeira não envie a informação o campo não será retornado.
   */
  PaymentAccountReference?: string;
}