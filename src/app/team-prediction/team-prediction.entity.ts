import {Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Prediction} from '../prediction/prediction.entity';
import {Competition} from '../competitions/competition.entity';
import {RankingTeam} from '../ranking-team/rankingTeam.entity';
import {Participant} from '../participant/participant.entity';
import {TeamPlayerController} from '../team-player/team-player.controller';
import {Teamplayer} from '../team-player/teamplayer.entity';

@Entity()
@Index(['competition', 'teamPlayer', 'participant', 'roundId'], {unique: true})

export class Teamprediction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    roundId: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;

    @ManyToOne(type => Prediction, prediction => prediction.predictions, {nullable: false})
    prediction: Prediction;

    @ManyToOne(type => Competition, competition => competition.predictions, {nullable: false})
    competition: Competition;

    @ManyToOne(type => Teamplayer, teamPlayer => teamPlayer.teamPredictions, {nullable: false})
    teamPlayer: Teamplayer;

    @ManyToOne(type => Participant, participant => participant.rankingPredictions, {nullable: false})
    participant: Participant;
}
