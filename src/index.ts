export interface ICieloConstructor {
  merchantId: string;
  merchantKey: string;
  debug?: boolean;
  sandbox?: boolean;
  requestId?: string;
}

export class Cielo {
  merchantId: string;
  merchantKey: string;
  debug: boolean;
  sandbox: boolean;
  requestId?: string | null;

  constructor(constructor: ICieloConstructor) {
    this.merchantId = constructor.merchantId;
    this.merchantKey = constructor.merchantKey;
    this.debug = constructor.debug || false;
    this.sandbox = constructor.sandbox || false;
    this.requestId = constructor.requestId || null;
  }

  creditCard() {
    
  }

}
