import {Module} from '@nestjs/common';
import {QuestionsPredictionController} from './questions-prediction.controller';
import {QuestionsPredictionService} from './questions-prediction.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {QuestionPrediction} from './question-prediction.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([QuestionPrediction]),
        QuestionsPredictionModule],
    controllers: [QuestionsPredictionController],
    providers: [QuestionsPredictionService]
})
export class QuestionsPredictionModule {
}
