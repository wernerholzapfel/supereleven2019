import {Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Competition} from '../competitions/competition.entity';
import {RankingTeam} from '../rankingTeams/rankingTeam.entity';
import {Participant} from '../participant/participant.entity';

@Entity()
@Index(['competition', 'team', 'participant' ], {unique: true})
export class RankingPrediction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    position: number;

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;

    @ManyToOne(type => Competition, competition => competition.predictions)
    competition: Competition;

    @ManyToOne(type => RankingTeam, team => team.rankingPredictions)
    team: RankingTeam;

    @ManyToOne(type => Participant, participant => participant.rankingPredictions)
    participant: Participant;

}

export class RankingPredictionRead extends RankingPrediction {
}
