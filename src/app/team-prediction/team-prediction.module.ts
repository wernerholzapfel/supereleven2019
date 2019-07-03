import {Module} from '@nestjs/common';
import {TeamPredictionController} from './team-prediction.controller';
import {TeamPredictionService} from './team-prediction.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Teamprediction} from './team-prediction.entity';
import {RoundService} from '../round/round.service';
import {Round} from '../round/round.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Teamprediction, Round]),
        TeamPredictionModule],
    controllers: [TeamPredictionController],
    providers: [TeamPredictionService, RoundService]
})
export class TeamPredictionModule {
}
