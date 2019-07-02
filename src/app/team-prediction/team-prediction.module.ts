import {Module} from '@nestjs/common';
import {TeamPredictionController} from './team-prediction.controller';
import {TeamPredictionService} from './team-prediction.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Competition} from '../competitions/competition.entity';
import {Teamprediction} from './team-prediction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Teamprediction]),
        TeamPredictionModule],
    controllers: [TeamPredictionController],
    providers: [TeamPredictionService]
})
export class TeamPredictionModule {
}
