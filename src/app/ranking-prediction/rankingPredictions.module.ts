import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RankingPredictionsController} from './rankingPredictionsController';
import {RankingPrediction} from './rankingPredictions.entity';
import {RankingPredictionsService} from './rankingPredictions.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([RankingPrediction]),
        RankingPredictionsModule],
    providers: [RankingPredictionsService],
    controllers: [RankingPredictionsController],
})
export class RankingPredictionsModule {
}