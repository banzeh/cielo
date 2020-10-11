import {
    EnumCartCategory,
    EnumCartHostHedge,
    EnumCartNonSensicalHedge,
    EnumCartObscenitiesHedge,
    EnumCartPhoneHedge,
    EnumCartType,
    EnumCartVelocityHedge
} from "../../enums";

export interface CartItemsModel {
    /**
     * Identifica que avaliará os endereços de cobrança e entrega 
     * para diferentes cidades, estados ou países
     * Tabela 1 - Payment.Fraudanalysis.Cart.Items{n}.GiftCategory
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-1-payment.fraudanalysis.cart.tems[n].giftcategory 
    */
    giftCategory?: EnumCartCategory,
    /**
     * Nível de importância dos endereços de IP e e-mail do comprador na análise de fraude
     * Tabela 2 - Payment.Fraudanalysis.Cart.Items{n}.HostHedge
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-2-payment.fraudanalysis.cart.items[n].hosthedge
    */
    hostHedge?: EnumCartHostHedge,
    /**
     * Nível de importância das verificações sobre os dados do comprador sem sentido na análise de fraude
     * Tabela 3 - Cart.Items{n}.NonSensicalHedge
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-3-payment.fraudanalysis.cart.items[n].nonsensicalhedge
    */
    nonSensicalHedge?: EnumCartNonSensicalHedge,
    /**
     * Nível de importância das verificações sobre os dados do comprador com obscenidade na análise de fraude
     * Tabela 4 - Payment.Fraudanalysis.Cart.Items{n}.ObscenitiesHedge
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-4-payment.fraudanalysis.cart.items[n].obscenitieshedge
     */
    obscenitiesHedge?: EnumCartObscenitiesHedge,
    /**
     * Nível de importância das verificações sobre os números de telefones do comprador na análise de fraude
     * Tabela 5 - Payment.Fraudanalysis.Cart.Items{n}.PhoneHedge
     */
    phoneHedge?: EnumCartPhoneHedge,
    /**
     * Nome do Produto
     */
    name: string,
    /**
     * Quantidade do produto
     */
    quantity: number,
    /**
     * SKU (Stock Keeping Unit - Unidade de Controle de Estoque) do produto
     */
    sku: string,
    /**
     * Preço unitário do produto
     * Ex: 10950 = r$ 109,50
     */
    unitPrice: number,
    /**
     * Nível de risco do produto associado a quantidade de chargebacks
     * Tabela 6 - Payment.Fraudanalysis.CartI.tems{n}.Risk
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-6-payment.fraudanalysis.cart.items[n].risk
     */
    risk?: string,
    /**
     * Nível de importância da hora do dia na análise de fraude que o comprador realizou o pedido
     * Tabela 7 - Payment.Fraudanalysis.Cart.Items{n}.TimeHedge
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-7-payment.fraudanalysis.cart.items[n].timehedge
     */
    timeHedge?: string,
    /**
     * Categoria do produto
     * Tabela 8 - Payment.Fraudanalysis.Cart.Items{n}.Type
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-8-payment.fraudanalysis.cart.items[n].type
     */
    type?: EnumCartType,
    /**
     * Nível de importância da frequência de compra do comprador na análise 
     * de fraude dentros dos 15 minutos anteriores
     * Tabela 9 - Payment.Fraudanalysis.Cart.Items{n}.VelocityHedge 
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-9-payment.fraudanalysis.cart.items[n].velocityhedge
     * */
    velocityHedge?: EnumCartVelocityHedge
}