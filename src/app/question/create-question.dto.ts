import {IsDefined, IsNumber, IsString} from 'class-validator';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {ApiModelProperty} from '@nestjs/swagger';

export class CreateQuestionDto {
    readonly id: string;

    @IsDefined() @IsString() @ApiModelProperty() readonly question: string;
    @IsDefined() @IsString() @ApiModelProperty() readonly answer: string;
    @IsNumber() @ApiModelProperty() readonly roundId: number;
    @IsDefined() @IsNumber() @ApiModelProperty() readonly competition: Competition;
    @IsDefined() @IsNumber() @ApiModelProperty() readonly prediction: Prediction;

}

export enum QuestionCorrect {
    Full = 'Full',
    Half = 'Half',
    None = 'None',
}
