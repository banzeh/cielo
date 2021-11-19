export enum EnumIdentityType {
  RG = 'RG',
  CPF = 'CPF',
  CNPJ = 'CNPJ'
}

export enum EnumPaymentInterest {
  MERCHANT = 'ByMerchant',
  ISSUER = 'ByIssuer'
}

export enum EnumCardType {
  CREDIT = 'CreditCard',
  DEBIT = 'DebitCard'
}

export enum EnumBrands {
  VISA = 'VISA',
  MASTER = 'MASTER',
  AMEX = 'AMEX',
  ELO = 'ELO',
  AURA = 'AURA',
  JCB = 'JCB',
  DINERS = 'DINERS',
  DISCOVERY = 'DISCOVERY',
  DISCOVER = 'DISCOVER',
  HIPERCARD = 'HIPERCARD'
}

export enum EnumRecurrentPaymentInterval {
  MONTHLY = 'MONTHLY',
  BIMONTHLY = 'BIMONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMIANNUAL = 'SEMIANNUAL',
  ANNUAL = 'ANNUAL',
}

export enum EnumRecurrentPaymentUpdateInterval {
  MONTHLY = 1,
  BIMONTHLY = 2,
  QUARTERLY = 3,
  SEMIANNUAL = 6,
  ANNUAL = 12,
}

export enum EnumTypeFlowAnalysisFraud {
  AnalyseFirst = 'AnalyseFirst',
  AuthorizeFirst = 'AuthorizeFirst'
}
export enum EnumSequenceCriteria {
  OnSuccess = 'OnSuccess',
  Always = 'Always'
}

export enum EnumShippingMethod {
  SameDay = 'SameDay', //	Meio de entrega no mesmo dia
  OneDay = 'OneDay', //	Meio de entrega no próximo dia
  TwoDay = 'TwoDay', //	Meio de entrega em dois dias
  ThreeDay = 'ThreeDay', //	Meio de entrega em três dias
  LowCost = 'LowCost', //	Meio de entrega de baixo custo
  Pickup = 'Pickup', //	Retirada na loja
  Other = 'Other', //	Outro meio de entrega
  None = 'None' //	Sem meio de entrega, pois é um serviço ou assinatura
}

export enum EnumTravelJourneyType {
  OneWayTrip = 'OneWayTrip', //	Viagem somente de ida
  RoundTrip = 'RoundTrip' //	Viagem de ida e volta
}

export enum EnumTravelPassengersStatus {
  Standard = 'Standard',
  Gold = 'Gold',
  Platinum = 'Platinum'
}

export enum EnumTravelPassengersRating {
  Adult = 'Adult', //	Adulto
  Child = 'Child', //	Criança
  Infant = 'Infant' //	Infantil
}

export enum EnumCartCategory {
  Yes = 'Yes', // Em caso de divergência entre endereços de cobrança e entrega, atribui risco baixo ao pedido
  No = 'No', // Em caso de divergência entre endereços de cobrança e entrega, atribui risco alto ao pedido (default)
  Off = 'Off' // Diferenças entre os endereços de cobrança e entrega não afetam a pontuação
}

export enum EnumCartHostHedge {
  Low = 'Low', //	Baixa
  Normal = 'Normal', //	Normal (default)
  High = 'High', //	Alta
  Off = 'Off' //	Não irá afetar o score da análise de fraude
}

export enum EnumCartNonSensicalHedge {
  Low = 'Low', //	Baixa
  Normal = 'Normal', //	Normal (default)
  High = 'High', //	Alta
  Off = 'Off' //	Não irá afetar o score da análise de fraude
}

export enum EnumCartObscenitiesHedge {
  Low = 'Low', //	Baixa
  Normal = 'Normal', //	Normal (default)
  High = 'High', //	Alta
  Off = 'Off' //	Não irá afetar o score da análise de fraude
}

export enum EnumCartPhoneHedge {
  Low = 'Low', //	Baixa
  Normal = 'Normal', //	Normal (default)
  High = 'High', //	Alta
  Off = 'Off' //	Não irá afetar o score da análise de fraude
}

export enum EnumCartTimeHedge {
  Low = 'Low', //	Baixa
  Normal = 'Normal', //	Normal (default)
  High = 'High', //	Alta
  Off = 'Off' //	Não irá afetar o score da análise de fraude
}
export enum EnumCartType {
  AdultContent = 'AdultContent', //	Conteúdo adulto
  Coupon = 'Coupon', //	Cupom aplicado para todo o pedido
  Default = 'Default', //	Valor default para o tipo do produto. Quando não enviado nenhum outro valor, assume-se o tipo sendo este
  EletronicGood = 'EletronicGood', //	Produto eletônico diferente de software
  EletronicSoftware = 'EletronicSoftware', //	Softwares distribuídos eletronicamente via download
  GiftCertificate = 'GiftCertificate', //	Vale presente
  HandlingOnly = 'HandlingOnly', //	Taxa que você cobra do seu cliente para cobrir os seus custos administrativos de venda. Ex.: Taxa de conveniência / Taxa de instalação
  Service = 'Service', //	Serviço que será realizado para o cliente
  ShippingAndHandling = 'ShippingAndHandling', //	Valor do frete e e taxa que você cobra do seu cliente para cobrir os seus custos administrativos de venda
  ShippingOnly = 'ShippingOnly', //	Valor do frete
  Subscription = 'Subscription', //	Assinatura. Ex.: Streaming de vídeos / Assinatura de notícias
}

export enum EnumCartVelocityHedge {
  Low = 'Low', //	Baixa
  Normal = 'Normal', //	Normal (default)
  High = 'High', //	Alta
  Off = 'Off' //	Não irá afetar o score da análise de fraude
}

export enum EnumFraudAnalysisStatus {
  Unknown = 0,
  Accept = 1,
  Reject = 2,
  Review = 3,
  Aborted = 4,
  Unfinished = 5
}
