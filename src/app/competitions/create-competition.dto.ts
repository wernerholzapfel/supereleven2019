import {IsBoolean, IsDateString, IsDefined, IsString} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class CreateCompetitionDto {
    readonly id: string;

    @ApiModelProperty()
    @IsDefined() @IsString() readonly tourName: string;

    @ApiModelProperty()
    @IsDefined() @IsDateString() readonly startDate: Date;

    @ApiModelProperty()
    @IsDefined() @IsDateString() readonly endDate: Date;

    @ApiModelProperty()
    @IsBoolean() readonly isActive: boolean;

}
