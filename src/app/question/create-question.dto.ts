import {IsDefined, IsNumber, IsString} from 'class-validator';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';

export class CreateQuestionDto {
    readonly id: string;

    @IsDefined() @IsString() readonly question: string;
    @IsDefined() @IsString() readonly answer: string;
    @IsNumber() readonly roundId: number;
    @IsDefined() @IsNumber() readonly competition: Competition;
    @IsDefined() @IsNumber() readonly prediction: Prediction;

}
