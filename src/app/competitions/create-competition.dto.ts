import {IsBoolean, IsDateString, IsDefined, IsString} from 'class-validator';

export class CreateCompetitionDto {
    readonly id: string;

    @IsDefined() @IsString() readonly tourName: string;

    @IsDefined() @IsDateString() readonly startDate: Date;

    @IsDefined() @IsDateString() readonly endDate: Date;

    @IsBoolean() readonly isActive: boolean;

}
