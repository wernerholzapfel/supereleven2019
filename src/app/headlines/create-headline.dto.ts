import {IsDefined, IsString} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';
import {Competition} from '../competitions/competition.entity';

// import {Tour} from '../tour/tour.entity';

export class CreateHeadlineDto {
    readonly id: string;

    @IsDefined() @IsString() @ApiModelProperty() readonly title: string;
    @IsDefined() @IsString() @ApiModelProperty() readonly text: string;
    @IsDefined() @IsString() @ApiModelProperty() readonly schrijver: string;
    @IsDefined() readonly competition: Competition;

}
