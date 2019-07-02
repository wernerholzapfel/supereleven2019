import {IsDefined, IsString} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class CreatePredictionDto {
    readonly id: string;

    @IsDefined() @IsString() @ApiModelProperty() readonly predictionType: PredictionType;

}

export enum PredictionType {
    Matches = 'Matches',
    Ranking = 'Ranking',
    Team = 'Team',
    Questions = 'Questions'
}