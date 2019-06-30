import {IsDefined, IsNumber} from 'class-validator';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {Match} from '../match/match.entity';

export class CreateMatchPredictionDto {
    readonly id: string;

    @IsNumber() readonly homeScore: number;
    @IsNumber() readonly awayScore: number;
    @IsNumber() readonly roundId: number;
    @IsDefined() readonly competition: Competition;
    @IsDefined() readonly prediction: Prediction;
    @IsDefined() match: Match;
}