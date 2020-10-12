export interface BrowserModel {    
        /** Identificador utilizado para cruzar informações obtidas do 
         * dispositivo do comprador. Este mesmo identificador deve ser utilizado
         * para gerar o valor que será atribuído ao campo session_id do script ou 
         * utilizando os SDKs (iOS ou Android) que será incluído na página de checkout.
         * Obs.: Este identificador poderá ser qualquer valor ou o número do pedido,
         * mas deverá ser único durante 48 horas 
        */
        browserFingerprint: string,
        /**
         * Identifica se o browser do comprador aceita cookies
         * Possíveis valores: true / false (default
        */
        cookiesAccepted: boolean,
        /**
         * Não E-mail registrado no browser do comprador. 
         * Pode diferenciar do e-mail de cadastro na loja(Customer.Email)
        */
        email?:string,
        /**
         * Nome do host informado pelo browser do comprador e identificado através do cabeçalho HTTP
         */
        hostName?: string,
        /**
         * Endereço de IP do comprador. Formato IPv4 ou IPv6
         */
        ipAddress: string,
        /**
         * Nome do browser utilizado pelo comprador e identificado através do cabeçalho HTTP
         * Ex.: Google Chrome, Mozilla Firefox, Safari, etc
        */
        type?: string
}