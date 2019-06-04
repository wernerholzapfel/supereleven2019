import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {OneToMany} from 'typeorm';
import {Prediction} from '../prediction/prediction.entity';
import {RankingPrediction} from '../rankingPredictions/rankingPredictions.entity';
import {RankingTeam} from '../rankingTeams/rankingTeam.entity';
import {Participant} from '../participant/participant.entity';

@Entity()
export class Competition {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    tourName: string;

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


}

export class CompetitionRead extends Competition {
}
