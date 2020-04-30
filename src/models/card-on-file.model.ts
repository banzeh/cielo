export interface CardOnFileModel {
  /**
   * First se o cartão foi armazenado e é seu primeiro uso.
   * Used se o cartão foi armazenado e ele já foi utilizado anteriormente em outra transação
   */
  usage?: string;
  /**
   * Indica o propósito de armazenamento de cartões, caso o campo “Usage” for “Used”.
   * Recurring - Compra recorrente programada (ex. assinaturas)
   * Unscheduled - Compra recorrente sem agendamento (ex. aplicativos de serviços)
   * Installments - Parcelamento através da recorrência
   * Veja Mais - https://developercielo.github.io/faq/faq-api-3-0#pagamento-com-credenciais-armazenadas
   */
  reason?: string;
}