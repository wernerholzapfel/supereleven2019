import {IsDefined} from 'class-validator';
import {Prediction} from '../prediction/prediction.entity';
import {Competition} from '../competitions/competition.entity';
import {Teamplayer} from '../team-player/teamplayer.entity';
import {ApiModelProperty} from '@nestjs/swagger';

export class CreateTeamPredictionDto {
    readonly id: string;

    @IsDefined() @ApiModelProperty() roundId: number;
    @IsDefined() @ApiModelProperty() prediction: Prediction;
    @IsDefined() @ApiModelProperty() competition: Competition;
    @IsDefined() @ApiModelProperty() teamPlayer: Teamplayer;
}
