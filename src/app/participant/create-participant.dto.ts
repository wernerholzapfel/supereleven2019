import {IsBoolean, IsDefined, IsString, IsDateString, Length} from 'class-validator';

export class CreateParticipantDto {
    readonly id: string;

    @IsDefined() @IsString() readonly email: string;

    @IsDefined() @IsString() readonly displayName: string;

    @IsDefined() @IsString() readonly teamName: string;

}