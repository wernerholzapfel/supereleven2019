import {IsDefined, IsString} from 'class-validator';
// import {Tour} from '../tour/tour.entity';

export class CreateHeadlineDto {
    readonly id: string;

    @IsDefined() @IsString() readonly title: string;
    @IsDefined() @IsString() readonly text: string;
    // @IsDefined() readonly tour: Tour;

}
