import {Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Prediction} from '../prediction/prediction.entity';
import {Competition} from '../competitions/competition.entity';
import {Participant} from '../participant/participant.entity';
import {Teamplayer} from '../team-player/teamplayer.entity';
import {Round} from '../round/round.entity';

@Entity()
export class Teamprediction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => Round, round => round.teampredictions, {nullable: false})
    round: Round;

    @ManyToOne(type => Round, round => round.teampredictions, {nullable: true})
    tillRound: Round;

    @ManyToOne(type => Round, round => round.teampredictions, {nullable: true})
    captainTillRound: Round;

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;

    @Column({default: false})
    captain: boolean;

    @Column({default: true})
    isActive: boolean;

    @ManyToOne(type => Prediction, prediction => prediction.predictions, {nullable: false})
    prediction: Prediction;

    @ManyToOne(type => Competition, competition => competition.predictions, {nullable: false})
    competition: Competition;

    @ManyToOne(type => Teamplayer, teamPlayer => teamPlayer.teamPredictions, {nullable: false})
    teamPlayer: Teamplayer;

    @ManyToOne(type => Participant, participant => participant.rankingPredictions, {nullable: false})
    participant: Participant;
}
