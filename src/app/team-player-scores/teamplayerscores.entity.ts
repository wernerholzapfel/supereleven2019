import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {Teamplayer} from '../team-player/teamplayer.entity';
import {Round} from '../round/round.entity';

@Entity()
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

    @Column('boolean')
    played: boolean;
    @Column('boolean')
    win: boolean;
    @Column('boolean')
    draw: boolean;
    @Column('boolean')
    cleansheet: boolean;
    @Column('boolean')
    yellow: boolean;
    @Column('boolean')
    secondyellow: boolean;
    @Column('boolean')
    red: boolean;
    @Column('int')
    goals: number;
    @Column('int')
    assists: number;
    @Column('int')
    penaltymissed: number;
    @Column('int')
    penaltystopped: number;
    @Column('int', {nullable: true})
    owngoal: number;

}
