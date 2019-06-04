import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {RankingPrediction} from '../rankingPredictions/rankingPredictions.entity';
import {Prediction} from '../prediction/prediction.entity';
import {RankingTeam} from '../rankingTeams/rankingTeam.entity';

@Entity()
export class Team {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    logoUrl: string;

    @OneToMany(type => RankingTeam, rankingTeam => rankingTeam.team)
    rankingTeam: RankingTeam[];

}

export class TeamRead extends Team {
}
