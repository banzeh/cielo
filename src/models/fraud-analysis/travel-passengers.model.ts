import { EnumTravelJourneyType, EnumTravelPassengersRating, EnumTravelPassengersStatus } from "../../enums"
import { TravelLegsModel } from "./travel-legs.model";

export interface TravelPassengersModel {
    /**
     * 	Nome completo do passageiro
     */
    name?: string,
    /**
     * Número do documento do passageiro
     */
    identity?: string,
    /**
     * Classificação da empresa aérea
     * Tabela 12 - Payment.FraudAnalysis.Travel.Passengers{n}.Status
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-12-payment.fraudanalysis.travel.passengers[n].status
     */
    status?: EnumTravelPassengersStatus,
    /**
     * Tipo do passageiro
     * Tabela 13 - Payment.FraudAnalysis.Travel.Passengers{n}.Rating
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-13-payment.fraudanalysis.travel.passengers[n].rating
     */
    rating?: EnumTravelPassengersRating,
    /**
     * E-mail do passageiro
     */
    email?: string,
    /**
     * Telefone do passageiro
     * Ex.: 552121114700
     */
    phone?: string,
    /**
     * Dados do aeroporto
     */
    travelLegs?: Array<TravelLegsModel>
}

