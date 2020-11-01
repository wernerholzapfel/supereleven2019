import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Connection, getManager, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {QuestionPrediction} from './question-prediction.entity';
import {CreateQuestionPredictionDto} from './create-question-prediction.dto';
import {Participant} from '../participant/participant.entity';
import {QuestionCorrect} from '../question/create-question.dto';

export interface UpdateQuestionPredictionParams {
    roundId: string;
    id: string;
    correct: QuestionCorrect;
}

@Injectable()
export class QuestionsPredictionService {

    constructor(private connection: Connection,
                @InjectRepository(QuestionPrediction)
                private readonly questionPrediction: Repository<QuestionPrediction>) {

    }

    async findQuestionsByPredictionIdForParticipant(predictionid: string, firebaseIdentifier: string): Promise<QuestionPrediction[]> {
        return await this.connection.getRepository(QuestionPrediction)
            .createQueryBuilder('questionsprediction')
            .leftJoin('questionsprediction.prediction', 'prediction')
            .leftJoin('questionsprediction.participant', 'participant')
            .leftJoinAndSelect('questionsprediction.question', 'question')
            .where('prediction.id = :id', {id: predictionid})
            .andWhere('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .getMany();

    }

    async findQuestionsByQuestionId(questionid: string): Promise<QuestionPrediction[]> {
        return await this.connection.getRepository(QuestionPrediction)
            .createQueryBuilder('questionsprediction')
            .leftJoinAndSelect('questionsprediction.participant', 'participant')
            .leftJoinAndSelect('questionsprediction.question', 'question')
            .where('question.id = :id', {id: questionid})
            .orderBy('questionsprediction.answer')
            .getMany();

    }

    async createQuestionPrediction(items: CreateQuestionPredictionDto[], firebaseIdentifier): Promise<QuestionPrediction[]> {
        const participant = await this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .where('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .getOne();

        return await this.questionPrediction.save(items.map(p => {
            return {
                ...p,
                participant
            }
        }))
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }


    async updateQuestionPrediction(items: UpdateQuestionPredictionParams[]): Promise<QuestionPrediction[]> {
        await getManager().transaction(async transactionalEntityManager => {
            return items.forEach(async item => {

                let punten = this.determineQuestionPunten(item.correct);

                return await transactionalEntityManager.getRepository(QuestionPrediction)
                    .createQueryBuilder('questionPrediction')
                    .update(QuestionPrediction)
                    .set({punten, round: {id: item.roundId}})
                    .where('id = :id', {id: item.id})
                    .execute();

            })
        });
        return [];
    }

    determineQuestionPunten(correct: QuestionCorrect): number {
        switch (correct) {
            case QuestionCorrect.Full: {
                return 20
            }
            case QuestionCorrect.Half: {
                return 10
            }
            case QuestionCorrect.None: {
                return 0
            }
            default:
                return 0
        }
    }

}
