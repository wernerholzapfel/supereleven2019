import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {RankingPrediction} from '../rankingPredictions/rankingPredictions.entity';
import {Competition} from '../competitions/competition.entity';

@Entity()
export class Participant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({select: false, unique: true})
    email: string;

    @Column({nullable: true})
    displayName: string;

    @Column({nullable: true})
    teamName: string;

    @OneToMany(type => RankingPrediction, prediction => prediction.participant)
    rankingPredictions: RankingPrediction[];

}

export class ParticipantRead extends Participant {
}
