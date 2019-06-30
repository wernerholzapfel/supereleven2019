import {IsDefined, IsNumber, IsString} from 'class-validator';
import {Column, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {MatchPrediction} from '../match-prediction/match-prediction.entity';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';

export class CreateMatchDto {
    readonly id: string;

    @IsDefined() @IsString() readonly homeTeam: string;
    @IsDefined() @IsString() readonly awayTeam: string;
    @IsNumber() readonly homeScore: number;
    @IsNumber() readonly awayScore: number;
    @IsNumber() readonly roundId: number;
    @IsDefined() @IsNumber() readonly competition: Competition;
    @IsDefined() @IsNumber() readonly prediction: Prediction;

}
