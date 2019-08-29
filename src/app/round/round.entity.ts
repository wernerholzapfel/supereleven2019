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
import {Teamplayerscores} from '../team-player-scores/teamplayerscores.entity';
import {Prediction} from '../prediction/prediction.entity';
import {MatchPrediction} from '../match-prediction/match-prediction.entity';
import {Competition} from '../competitions/competition.entity';
import {Match} from '../match/match.entity';

@Entity()
export class Round {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('timestamp with time zone')
    startDate: Date;

    @Column('tstzrange')
    period: Date[];

    @OneToMany(type => Round, round => round.teampredictions)
    teampredictions: Teamprediction[];

    @OneToMany(type => Round, round => round.matchPredictions)
    matchPredictions: MatchPrediction[];

    @OneToMany(type => Round, round => round.matches)
    matches: Match[];

    @OneToMany(type => Round, round => round.teamplayerscores)
    teamplayerscores: Teamplayerscores[];

    @ManyToOne(type => Prediction, prediction => prediction.rounds)
    prediction: Prediction;

    @ManyToOne(type => Competition, competition => competition.rounds)
    competition: Competition;

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;


}
