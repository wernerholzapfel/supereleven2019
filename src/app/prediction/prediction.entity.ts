import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PredictionType} from './create-prediction.dto';
import {Competition} from '../competitions/competition.entity';
import {RankingTeam} from '../rankingTeams/rankingTeam.entity';
import {Match} from '../match/match.entity';

@Entity()
export class Prediction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: PredictionType,
    })
    predictionType: PredictionType;

    @ManyToOne(type => Competition, competition => competition.predictions)
    competition: Competition;

    @ManyToOne(type => RankingTeam, rankingTeam => rankingTeam.prediction)
    rankingTeam: RankingTeam;

    @ManyToOne(type => Match, match => match.prediction)
    match: Match;

    @OneToMany(type => Prediction, prediction => prediction.competition)
    predictions: Prediction[];

}

export class PredictionRead extends Prediction {
}
