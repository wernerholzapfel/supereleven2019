import {IsDefined} from 'class-validator';
import {Prediction} from '../prediction/prediction.entity';
import {Competition} from '../competitions/competition.entity';
import {Teamplayer} from '../team-player/teamplayer.entity';

export class CreateTeamPredictionDto {
    readonly id: string;

    @IsDefined() roundId: number;
    @IsDefined() prediction: Prediction;
    @IsDefined() competition: Competition;
    @IsDefined() teamPlayer: Teamplayer;
}
