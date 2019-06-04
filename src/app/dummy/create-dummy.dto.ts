import {IsDefined, IsString} from 'class-validator';

export class CreateDummyDto {
    readonly id: string;

    @IsDefined() @IsString() readonly dummy: string;

}
