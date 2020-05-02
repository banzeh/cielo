import { AirlineDataModel } from './airline-data.model';
import { CreditCardModel } from './credit-card.model';
import { EnumPaymentInterest, EnumCardType } from "../enums";
import { RecurrentPaymentModel } from './recurrent-payment';

export interface PaymentRequestModel {
  /**
   * Moeda na qual o pagamento será feito (BRL).
   */
  currency?: string;
  /**
   * Pais na qual o pagamento será feito.
   */
  country?: string;
  /**
   * Aplicável apenas para empresas aéreas. Montante do valor da autorização que deve ser destinado à taxa de serviço. Obs.: Esse valor não é adicionado ao valor da autorização.
   */
  serviceTaxAmount?: number;
  /**
   * Número de Parcelas.
   */
  installments: number;
  /**
   * Tipo de parcelamento - Loja (ByMerchant) ou Cartão (ByIssuer).
   */
  interest?: EnumPaymentInterest;
  /**
   * Booleano que identifica que a autorização deve ser com captura automática.
   */
  capture?: boolean;
  /**
   * Define se o comprador será direcionado ao Banco emissor para autenticação do cartão
   */
  authenticate?: boolean;
  /**
   * Texto impresso na fatura bancaria comprador - Exclusivo para VISA/MASTER - não permite caracteres especiais - Ver Anexo
   */
  softDescriptor: string;
  /**
   * Dados do cartão
   */
  creditCard: CreditCardModel;
  /**
   * Deve ser enviado com valor “true” caso se trate de uma transação de compra ou venda de Criptomoeda
   */
  isCryptoCurrencyNegotiation?: boolean;
  /**
   * Tipo do Meio de Pagamento.
   */
  type: EnumCardType;
  /**
   * Valor do Pedido (ser enviado em centavos).
   */
  amount: number;
  /**
   * Informar o número do principal bilhete aéreo da transação.
   */
  airlineData?: AirlineDataModel;
  /**
   * Define comportamento do meio de pagamento (ver Anexo)/NÃO OBRIGATÓRIO PARA CRÉDITO.
   */
  provider?: string;
  /**
   * URI para onde o usuário será redirecionado após o fim do pagamento
   */
  ReturnUrl?: string;

  /**
   * Informações de recorrência de pagamento
   */
  recurrentPayment?: RecurrentPaymentModel,
}