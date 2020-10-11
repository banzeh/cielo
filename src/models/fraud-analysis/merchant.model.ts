/**
 * Nível de Relevância
 * 1 - Relevante
 * 2 - Muito Relevante
 * 3 - Extremamente Relevante
 * Conforme nível de relevância dos campos e possibilidade de desenho da estratégia
 * de risco de acordo com a necessidade do seu negócio, na validação das transações
 * de testes os mesmos serão cobrados caso não sejam enviaos. Com isso, solicitamos
 * uma análise prévia da documentação e sinalização dos campos que não serão 
 * possíveis de serem enviados.
 * No caso de não possuir o dado para enviar, pedimos a gentileza de não enviar 
 * o campo correspondente como vazio, ou seja, apenas não enviar.
 */
export interface MerchantModel {
    /**
     * ID das informações adicionais a serem enviadas
     * Tabela 20 - Payment.FraudAnalysis.MerchantDefinedFields
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-20-payment.fraudanalysis.merchantdefinedfields
     */
    id: number,
    /**
     * Valor das informações adicionais a serem enviadas
     * Tabela 20 - Payment.FraudAnalysis.MerchantDefinedFields
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-20-payment.fraudanalysis.merchantdefinedfields
     */
    value: string   
}