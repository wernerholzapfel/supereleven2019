import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Participant} from '../participant/participant.entity';
import {StandService} from './stand.service';
import {StandController} from './stand.controller';
import {TeamPredictionService} from '../team-prediction/team-prediction.service';
import {TeamPredictionModule} from '../team-prediction/team-prediction.module';
import {Teamprediction} from '../team-prediction/team-prediction.entity';
import {RoundService} from '../round/round.service';
import {RoundModule} from '../round/round.module';
import {Round} from '../round/round.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Participant, Teamprediction, Round]),
        StandModule,
        TeamPredictionModule,
        RoundModule],
    providers: [StandService, TeamPredictionService, RoundService],
    controllers: [StandController]
})
export class StandModule {
}
