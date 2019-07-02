import {Column, Entity, Generated, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import {RankingPrediction} from '../ranking-prediction/rankingPredictions.entity';
import {Competition} from '../competitions/competition.entity';
import {Teamprediction} from '../team-prediction/team-prediction.entity';

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

    @OneToMany(type => Teamprediction, prediction => prediction.participant)
    teamPredictions: Teamprediction[];

}

export class ParticipantRead extends Participant {
}
