export interface ConsultBinResponseModel {
  status: string;
  provider: string;
  cardType: string;
  foreignCard: boolean;
  corporateCard: boolean;
  issuer: string;
  issuerCode: string;
}