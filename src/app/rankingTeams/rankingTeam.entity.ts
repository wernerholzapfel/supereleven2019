import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {RankingPrediction} from '../rankingPredictions/rankingPredictions.entity';
import {Competition} from '../competitions/competition.entity';
import {Team} from '../teams/team.entity';

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

    @ManyToOne(type => Team, team => team.rankingTeam)
    team: Team;

}

export class RankingTeamRead extends RankingTeam {
}
