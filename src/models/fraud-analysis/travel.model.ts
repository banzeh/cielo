import { EnumTravelJourneyType } from "../../enums"
import { TravelPassengersModel } from "./travel-passengers.model";

export interface TravelModel {
    /**
     * Tipo de viagem
     * Tabela 11 - Payment.FraudAnalysis.Travel.JourneyType
     * https://developercielo.github.io/manual/cielo-ecommerce#tabela-11-payment.fraudanalysis.travel.journeytype
     */
    journeyType?: EnumTravelJourneyType,
    /**
     * Data e hora de partida
     * Ex.: 2018-03-31 19:16:38
     */
    departureTime: string,    
    passengers: Array<TravelPassengersModel>
}

