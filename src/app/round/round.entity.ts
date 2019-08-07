import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Teamprediction} from '../team-prediction/team-prediction.entity';
import {RankingPrediction} from '../ranking-prediction/rankingPredictions.entity';
import {Teamplayerscores} from '../team-player-scores/teamplayerscores.entity';
import {Prediction} from '../prediction/prediction.entity';

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

    @OneToMany(type => Round, round => round.teamplayerscores)
    teamplayerscores: Teamplayerscores[];

    @ManyToOne(type => Prediction, prediction => prediction.rounds)
    prediction: Prediction;

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;



}
