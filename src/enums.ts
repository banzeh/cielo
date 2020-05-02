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
