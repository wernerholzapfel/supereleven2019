import {Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {Participant} from '../participant/participant.entity';
import {Match} from '../match/match.entity';

@Entity()
@Index(['participant', 'match'], {unique: true})
export class MatchPrediction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => Match, match => match.matchPredictions, {nullable: false})
    match: Match;

    @Column({nullable: true})
    homeScore: number;

    @Column({nullable: true})
    awayScore: number;

    @ManyToOne(type => Competition, competition => competition.predictions, {nullable: false})
    competition: Competition;

    @ManyToOne(type => Prediction, prediction => prediction.match, {nullable: false})
    prediction: Prediction;

    @ManyToOne(type => Participant, participant => participant.rankingPredictions, {nullable: false})
    participant: Participant;

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;
}
