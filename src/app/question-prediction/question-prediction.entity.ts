import {Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Match} from '../match/match.entity';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {Participant} from '../participant/participant.entity';
import {Question} from '../question/question.entity';
import {Round} from '../round/round.entity';

@Entity()
@Index(['participant', 'question'], {unique: true})
export class QuestionPrediction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(type => Question, question => question.questionPredictions, {nullable: false})
    question: Question;

    @Column({nullable: true})
    answer: string;

    @Column({nullable: true})
    punten: number;

    @ManyToOne(type => Round, round => round.questionPredictions, {nullable: true})
    round: Round;

    @ManyToOne(type => Competition, competition => competition.predictions, {nullable: false})
    competition: Competition;

    @ManyToOne(type => Prediction, prediction => prediction.match, {nullable: false})
    prediction: Prediction;

    @ManyToOne(type => Participant, participant => participant.questionPredictions, {nullable: false})
    participant: Participant;

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;
}
