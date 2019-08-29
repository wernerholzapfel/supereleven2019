import {IsDefined, IsNumber, IsString} from 'class-validator';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {ApiModelProperty} from '@nestjs/swagger';
import {Round} from '../round/round.entity';

export class CreateMatchDto {
    readonly id: string;

    @IsDefined() @IsString() @ApiModelProperty() readonly homeTeam: string;
    @IsDefined() @IsString() @ApiModelProperty() readonly awayTeam: string;
    @IsNumber() @ApiModelProperty() readonly homeScore: number;
    @IsNumber() @ApiModelProperty() readonly awayScore: number;
    @IsDefined() @ApiModelProperty() readonly round: Round;
    @IsDefined() @IsNumber() @ApiModelProperty() readonly competition: Competition;
    @IsDefined() @IsNumber() @ApiModelProperty() readonly prediction: Prediction;

}
