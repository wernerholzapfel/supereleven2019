import {IsDefined, IsString} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class CreateRankingTeamDto {
    readonly id: string;

    @IsDefined() @IsString() @ApiModelProperty() readonly dummy: string;

}
