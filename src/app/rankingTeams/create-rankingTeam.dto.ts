import {IsDefined, IsString} from 'class-validator';

export class CreateRankingTeamDto {
    readonly id: string;

    @IsDefined() @IsString() readonly dummy: string;

}
