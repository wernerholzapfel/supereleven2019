import {Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Competition} from '../competitions/competition.entity';
import {RankingTeam} from '../rankingTeams/rankingTeam.entity';
import {Participant} from '../participant/participant.entity';
import {Prediction} from '../prediction/prediction.entity';
import {Team} from '../teams/team.entity';

@Entity()
@Index(['competition', 'team', 'participant' ], {unique: true})
export class RankingPrediction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    position: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;

    @ManyToOne(type => Prediction, prediction => prediction.predictions, {nullable: false})
    prediction: Prediction;

    @ManyToOne(type => Competition, competition => competition.predictions, {nullable: false})
    competition: Competition;

    @ManyToOne(type => RankingTeam, team => team.rankingPredictions, {nullable: false})
    team: RankingTeam;

    @ManyToOne(type => Participant, participant => participant.rankingPredictions, {nullable: false})
    participant: Participant;

}

export class RankingPredictionRead extends RankingPrediction {
}
