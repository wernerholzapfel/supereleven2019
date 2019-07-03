import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Teamprediction} from '../team-prediction/team-prediction.entity';
import {RankingPrediction} from '../ranking-prediction/rankingPredictions.entity';

@Entity()
export class Round {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('timestamp with time zone')
    startDate: Date;

    @Column('timestamp with time zone')
    endDate: Date;

    @Column('tstzrange')
    period: Date[];

    @OneToMany(type => Round, round => round.teampredictions)
    teampredictions: Teamprediction[];

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;


}
