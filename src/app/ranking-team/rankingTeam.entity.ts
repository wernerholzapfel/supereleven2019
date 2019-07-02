import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {RankingPrediction} from '../ranking-prediction/rankingPredictions.entity';
import {Competition} from '../competitions/competition.entity';
import {Team} from '../team/team.entity';
import {Prediction} from '../prediction/prediction.entity';

@Entity()
export class RankingTeam {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: true})
    position: number;

    @Column({nullable: true})
    roundId: number;

    @OneToMany(type => RankingPrediction, prediction => prediction.team)
    rankingPredictions: RankingPrediction[];

    @ManyToOne(type => Competition, competition => competition.predictions)
    competition: Competition;

    @ManyToOne(type => Prediction, prediction => prediction.rankingTeam)
    prediction: Prediction;

    @ManyToOne(type => Team, team => team.rankingTeam)
    team: Team;

}

export class RankingTeamRead extends RankingTeam {
}
