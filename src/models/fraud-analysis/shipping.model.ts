import { EnumShippingMethod } from "../../enums";

export interface ShippingModel {
    /**
     * Nome completo do responsável a receber o produto no endereço de entrega
     */
    addressee?: string,
    /**
     * Meio de entrega do pedido
     * Tabela 10 - Payment.Fraudanalysis.Shipping.Method
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-10-payment.fraudanalysis.shipping.method
     */
    method?: EnumShippingMethod,
    /**
     * Número do telefone do responsável a receber o produto no endereço de entrega
     * Ex.: 552121114700
     */
    phone?: string
}