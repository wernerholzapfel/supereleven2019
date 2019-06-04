import {IsDefined, IsString} from 'class-validator';

export class CreatePredictionDto {
    readonly id: string;

    @IsDefined() @IsString() readonly predictionType: PredictionType;

}

export enum PredictionType {
    Matches = 'Matches',
    Ranking = 'Ranking',
    Team = 'Team',
    Questions = 'Questions'
}