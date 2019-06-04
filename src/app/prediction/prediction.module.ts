import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PredictionService} from './prediction.service';
import {PredictionsController} from './predictions.controller';
import {Prediction} from './prediction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Prediction]),
        PredictionModule],
    providers: [PredictionService],
    controllers: [PredictionsController],
})
export class PredictionModule {
}