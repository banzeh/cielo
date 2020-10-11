import { EnumFraudAnalysisStatus } from "../../enums";
import { ReplyDataResponseModel } from "./replay-data.model";

export interface FraudAnalysisResponseModel {
    id: string,
    status: EnumFraudAnalysisStatus,
    fraudAnalysisReasonCode: number
    replyData: ReplyDataResponseModel
}