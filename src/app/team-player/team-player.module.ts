import {Module} from '@nestjs/common';
import {TeamPlayerController} from './team-player.controller';
import {TeamPlayerService} from './team-player.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Teamplayer} from './teamplayer.entity';
import {TeamPredictionService} from '../team-prediction/team-prediction.service';
import {TeamPredictionModule} from '../team-prediction/team-prediction.module';
import {RoundService} from '../round/round.service';
import {Round} from '../round/round.entity';
import {Teamprediction} from '../team-prediction/team-prediction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Teamplayer, Round, Teamprediction]),
        TeamPlayerModule,
    TeamPredictionModule],
    controllers: [TeamPlayerController],
    providers: [TeamPlayerService, TeamPredictionService, RoundService]
})
export class TeamPlayerModule {
}
