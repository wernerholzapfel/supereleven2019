import {Column, Entity, Generated, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from 'typeorm';
import {RankingPrediction} from '../ranking-prediction/rankingPredictions.entity';
import {Competition} from '../competitions/competition.entity';
import {Teamprediction} from '../team-prediction/team-prediction.entity';
import {MatchPrediction} from '../match-prediction/match-prediction.entity';
import {QuestionPrediction} from '../question-prediction/question-prediction.entity';

@Entity()
export class Participant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({select: false, unique: true})
    email: string;

    @Column({select: false})
    firebaseIdentifier: string;

    @Column({nullable: true})
    displayName: string;

    @Column({nullable: true})
    teamName: string;

    @OneToMany(type => RankingPrediction, prediction => prediction.participant)
    rankingPredictions: RankingPrediction[];

    @OneToMany(type => Teamprediction, prediction => prediction.participant)
    teamPredictions: Teamprediction[];

    @OneToMany(type => MatchPrediction, prediction => prediction.participant)
    matchPredictions: MatchPrediction[];

    @OneToMany(type => QuestionPrediction, prediction => prediction.participant)
    questionPredictions: QuestionPrediction[];

}

export class ParticipantRead extends Participant {
}
