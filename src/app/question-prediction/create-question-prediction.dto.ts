import {IsDefined, IsNumber, IsString} from 'class-validator';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {Question} from '../question/question.entity';
import {ApiModelProperty} from '@nestjs/swagger';

export class CreateQuestionPredictionDto {
    readonly id: string;

    @IsDefined() @IsString() @ApiModelProperty() readonly answer: string;
    @IsNumber() @ApiModelProperty() readonly roundId: number;
    @IsDefined() @ApiModelProperty() readonly competition: Competition;
    @IsDefined() @ApiModelProperty() readonly prediction: Prediction;
    @IsDefined() @ApiModelProperty() question: Question;
}