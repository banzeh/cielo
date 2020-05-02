export interface AddressModel {
  /**
   * Endereço do Comprador.
   */
  street?: string;
  /**
   * Número do endereço do Comprador.
   */
  number?: string;
  /**
   * Complemento do endereço do Comprador.br
   */
  complement?: string;
  /**
   * CEP do endereço do Comprador.
   */
  zipCode?: string;
  /**
   * Bairro do Comprador.
   */
  district?: string;
  /**
   * 	Cidade do endereço do Comprador.
   */
  city?: string;
  /**
   * Estado do endereço do Comprador.
   */
  state?: string;
  /**
   * Pais do endereço do Comprador.
   */
  country?: string;
}