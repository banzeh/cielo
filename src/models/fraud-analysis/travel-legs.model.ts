export interface TravelLegsModel {
    /**
     * Código do aeroporto de partida. Mais informações em IATA 3-Letter Codes
     * http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm
     */
    origin?: string,
    /**
     * Não	Código do aeroporto de chegada. Mais informações em IATA 3-Letter Codes
     * http://www.nationsonline.org/oneworld/IATA_Codes/airport_code_list.htm
     */
    destination?: string
}