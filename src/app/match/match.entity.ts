import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {MatchPrediction} from '../match-prediction/match-prediction.entity';

@Entity()
export class Match {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    homeTeam: string;

    @Column()
    awayTeam: string;

    @Column({nullable: true})
    homeScore: number;

    @Column({nullable: true})
    awayScore: number;

    @Column({nullable: true})
    roundId: number;

    @Column({nullable:true, type: 'date'})
    date: Date;

    @OneToMany(type => MatchPrediction, matchPrediction => matchPrediction.match)
    matchPredictions: MatchPrediction[];

    @ManyToOne(type => Competition, competition => competition.predictions)
    competition: Competition;

    @ManyToOne(type => Prediction, prediction => prediction.rankingTeam)
    prediction: Prediction;

}
