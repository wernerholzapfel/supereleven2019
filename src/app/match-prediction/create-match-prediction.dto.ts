import {IsDefined, IsNumber} from 'class-validator';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {Match} from '../match/match.entity';
import {ApiModelProperty} from '@nestjs/swagger';

export class CreateMatchPredictionDto {
    readonly id: string;

    @IsNumber() @ApiModelProperty() readonly homeScore: number;
    @IsNumber() @ApiModelProperty() readonly awayScore: number;
    @IsNumber() @ApiModelProperty() readonly roundId: number;
    @IsDefined() @ApiModelProperty() readonly competition: Competition;
    @IsDefined() @ApiModelProperty() readonly prediction: Prediction;
    @IsDefined() @ApiModelProperty() match: Match;
}