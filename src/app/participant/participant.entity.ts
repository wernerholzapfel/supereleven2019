import {Column, Entity, Generated, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import {RankingPrediction} from '../rankingPredictions/rankingPredictions.entity';
import {Competition} from '../competitions/competition.entity';

@Entity()
export class Participant {
    @Column()
    @Generated("uuid")
    id: string;

    @Column({select: false, unique: true})
    email: string;

    @PrimaryColumn({select: false})
    firebaseIdentifier: string;

    @Column({nullable: true})
    displayName: string;

    @Column({nullable: true})
    teamName: string;

    @OneToMany(type => RankingPrediction, prediction => prediction.participant)
    rankingPredictions: RankingPrediction[];

}

export class ParticipantRead extends Participant {
}
