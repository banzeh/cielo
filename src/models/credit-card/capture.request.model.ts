export interface CaptureRequestModel {
  /**
   * Campo Identificador do Pedido.
   */
  paymentId: string;
  /**
   * Valor do Pedido (ser enviado em centavos).
   */
  amount?: number;
  /**
   * Aplicável apenas para empresas aéreas.
   * Montante do valor da autorização que deve ser destinado à taxa de serviço.
   * Obs.: Esse valor não é adicionado ao valor da autorização.	
   */
  serviceTaxAmount?: string;
}