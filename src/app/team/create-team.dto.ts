import {IsDefined, IsString} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class CreateTeamDto {
    readonly id: string;

    @IsDefined() @IsString() @ApiModelProperty() readonly team: string;
    @IsDefined() @IsString() @ApiModelProperty() readonly logoUrl: string;

}
