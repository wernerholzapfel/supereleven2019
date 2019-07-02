import {IsDefined, IsNumber, IsString} from 'class-validator';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {Question} from '../question/question.entity';

export class CreateQuestionPredictionDto {
    readonly id: string;

    @IsDefined() @IsString() readonly answer: string;
    @IsNumber() readonly roundId: number;
    @IsDefined() readonly competition: Competition;
    @IsDefined() readonly prediction: Prediction;
    @IsDefined() question: Question;
}