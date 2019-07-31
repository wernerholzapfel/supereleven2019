import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {RankingPrediction} from '../ranking-prediction/rankingPredictions.entity';
import {Prediction} from '../prediction/prediction.entity';
import {RankingTeam} from '../ranking-team/rankingTeam.entity';
import {Teamplayer} from '../team-player/teamplayer.entity';

@Entity()
export class Team {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text', {nullable: true})
    logoUrl: string;

    @OneToMany(type => RankingTeam, rankingTeam => rankingTeam.team)
    rankingTeam: RankingTeam[];

    @OneToMany(type => Teamplayer, teamPlayer => teamPlayer.team)
    teamPlayer: Teamplayer[];

}

export class TeamRead extends Team {
}
