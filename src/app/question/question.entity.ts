import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {QuestionPrediction} from '../question-prediction/question-prediction.entity';
import {Round} from '../round/round.entity';

@Entity()
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    question: string;

    @Column({nullable: true})
    answer: string;

    @ManyToOne(type => Round, round => round.questions, {nullable: true})
    round: Round;

    @Column({nullable: true})
    sortId: number;

    @OneToMany(type => QuestionPrediction, questionPrediction => questionPrediction.question)
    questionPredictions: QuestionPrediction[];

    @ManyToOne(type => Competition, competition => competition.predictions)
    competition: Competition;

    @ManyToOne(type => Prediction, prediction => prediction.rankingTeam)
    prediction: Prediction;

}
