import {IsDefined, IsString} from 'class-validator';
import {ApiModelProperty} from '@nestjs/swagger';

export class CreateParticipantDto {
    readonly id: string;

    @IsDefined() @IsString() @ApiModelProperty() readonly email: string;

    @IsDefined() @IsString() @ApiModelProperty() readonly displayName: string;

    @IsDefined() @IsString() @ApiModelProperty() readonly teamName: string;

}