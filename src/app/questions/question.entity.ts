import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {QuestionPrediction} from '../questions-prediction/question-prediction.entity';

@Entity()
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    question: string;

    @Column({nullable: true})
    answer: string;

    @Column({nullable: true})
    roundId: number;

    @OneToMany(type => QuestionPrediction, questionPrediction => questionPrediction.question)
    questionPredictions: QuestionPrediction[];

    @ManyToOne(type => Competition, competition => competition.predictions)
    competition: Competition;

    @ManyToOne(type => Prediction, prediction => prediction.rankingTeam)
    prediction: Prediction;

}
