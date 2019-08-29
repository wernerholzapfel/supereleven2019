import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {QuestionPrediction} from './question-prediction.entity';
import {CreateQuestionPredictionDto} from './create-question-prediction.dto';
import {Participant} from '../participant/participant.entity';

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
}
