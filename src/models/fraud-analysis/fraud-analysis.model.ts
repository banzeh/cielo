import { EnumSequenceCriteria, EnumTypeFlowAnalysisFraud } from "../../enums"
import { BrowserModel } from "./browser.model"
import { CartModel } from "./cart.model"
import { MerchantModel } from "./merchant.model"
import { ShippingModel } from "./shipping.model"
import { TravelModel } from "./travel.model"

export interface FraudAnalysisModel {
    /**
     * Provedor de AntiFraude
     * Possíveis valores: Cybersource
    */
    provider?: string,
    /**
     * Tipo de fluxo da análise de fraude
     * Possíveis valores: AnalyseFirst / AuthorizeFirst
    */
    sequence?: EnumTypeFlowAnalysisFraud,
    /**
     * Critério do fluxo da análise de fraude
     * Possíveis valores: OnSuccess / Always
    */
    sequenceCriteria?: EnumSequenceCriteria,
    /**
     * Indica se a transação após a análise de fraude será capturada
     * Possíveis valores: true / false (default)
     * Obs.: Quando enviado igual a true e o retorno da análise de fraude for 
     * de baixo risco (Accept) a transação anteriormente autorizada será capturada
     * Obs2.: Quando enviado igual a true e o retorno da análise de fraude for 
     * revisão (Review) a transação ficará autorizada. A mesma será capturada após 
     * a Cielo receber o novo status da análise manual e este for de baixo risco (Accept)
     * Obs.: Para a utilização deste parâmetro, a sequência do fluxo de análise de 
     * risco deve ser obrigatoriamente AuthorizeFirst
    */
    captureOnLowRisk?: boolean,
    /**
     * Indica se a transação após a análise de fraude será cancelada
     * Possíveis valores: true / false (default)
     * Obs.: Quando enviado igual a true e o retorno da análise de fraude for de alto 
     * risco (Reject) a transação anteriormente autorizada será cancelada
     * Obs2.: Quando enviado igual a true e o retorno da análise de fraude for 
     * revisão (Review) a transação ficará autorizada. A mesma será cancelada após a 
     * Cielo receber o novo status da análise manual e este for alto risco (Reject)
     * Obs.: Para a utilização deste parâmetro, a sequência do fluxo de análise de 
     * risco deve ser obrigatoriamente AuthorizeFirst     
    */
    voidOnHighRisk?: boolean,
    /**
     * Valor total do pedido em centavos
     * Ex: 123456 = r$ 1.234,56
    */
    totalOrderAmount?: number,
    /**Identificador utilizado para cruzar informações obtidas do dispositivo do comprador. 
      * Este mesmo identificador deve ser utilizado para gerar o valor que será atribuído 
      * ao campo session_id do script ou utilizando os SDKs (iOS ou Android) que será 
      * incluído na página de checkout. Obs.: Este identificador poderá ser qualquer 
      * valor ou o número do pedido, mas deverá ser único durante 48 horas 
    */
    browser?: BrowserModel,
    /**
     * Indica se o pedido realizado pelo comprador é para presente
     */
    Cart?: CartModel,
    /**
     * ID das informações adicionais a serem enviadas
     */
    merchantDefinedFields?: Array<MerchantModel>,
    /**
     * Endereço de entrega
     */
    shipping?: ShippingModel,
    /**
     * Tipo de viagem
     */
    travel?: TravelModel,
}