import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Prediction} from '../prediction/prediction.entity';
import {RankingPrediction} from '../ranking-prediction/rankingPredictions.entity';
import {RankingTeam} from '../ranking-team/rankingTeam.entity';
import {Participant} from '../participant/participant.entity';
import {Round} from '../round/round.entity';

@Entity()
export class Competition {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column({type: 'date'})
    startDate: Date;

    @Column({type: 'date'})
    endDate: Date;

    @Column({type: 'timestamp', nullable: true})
    deadline: Date;

    @Column({default: false})
    isActive: boolean;

    @Column({default: false})
    hasEnded: boolean;

    @ManyToMany(type => Participant)
    @JoinTable()
    participants: Participant[];

    @OneToMany(type => Prediction, prediction => prediction.competition)
    predictions: Prediction[];

    @OneToMany(type => RankingPrediction, rankingPrediction => rankingPrediction.competition)
    rankingPredictions: RankingPrediction[];

    @OneToMany(type => RankingTeam, rankingTeam => rankingTeam.competition)
    rankingTeams: RankingTeam[];

    @OneToMany(type => Round, round => round.competition)
    rounds: Round[];

}

export class CompetitionRead extends Competition {
}
