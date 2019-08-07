import {Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {Teamplayer} from '../team-player/teamplayer.entity';
import {Round} from '../round/round.entity';

@Entity()
@Index(['teamPlayer', 'competition', 'prediction','round' ], {unique: true})
export class Teamplayerscores {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => Teamplayer, teamPlayer => teamPlayer.teamplayerscores)
    teamPlayer: Teamplayer;

    @ManyToOne(type => Competition, competition => competition.predictions)
    competition: Competition;

    @ManyToOne(type => Prediction, prediction => prediction.teamplayer)
    prediction: Prediction;

    @ManyToOne(type => Round, round => round.teamplayerscores)
    round: Round;

    @Column('boolean', {default: false})
    played: boolean;
    @Column('boolean', {default: false})
    win: boolean;
    @Column('boolean', {default: false})
    draw: boolean;
    @Column('boolean', {default: false})
    cleansheet: boolean;
    @Column('boolean', {default: false})
    yellow: boolean;
    @Column('boolean', {default: false})
    secondyellow: boolean;
    @Column('boolean', {default: false})
    red: boolean;
    @Column('int', {default: 0})
    goals: number;
    @Column('int', {default: 0})
    assists: number;
    @Column('int', {default: 0})
    penaltymissed: number;
    @Column('int', {default: 0})
    penaltystopped: number;
    @Column('int', {default: 0})
    owngoal: number;
}

export class TeamplayerScoresResponse {
    played: boolean;
    win: boolean;
    draw: boolean;
    cleansheet: boolean;
    yellow: boolean;
    secondyellow: boolean;
    red: boolean;
    goals: number;
    assists: number;
    penaltymissed: number;
    penaltystopped: number;
    owngoal: number;
}
