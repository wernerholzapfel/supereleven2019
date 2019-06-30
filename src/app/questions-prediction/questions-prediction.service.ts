import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {MatchPrediction} from '../match-prediction/match-prediction.entity';
import {CreateMatchPredictionDto} from '../match-prediction/create-match-prediction.dto';
import {QuestionPrediction} from './question-prediction.entity';
import {CreateQuestionPredictionDto} from './create-question-prediction.dto';

@Injectable()
export class QuestionsPredictionService {

    constructor(private connection: Connection,
                @InjectRepository(QuestionPrediction)
                private readonly questionPrediction: Repository<QuestionPrediction>) {

    }

    async findQuestionsByPredictionIdForParticipant(predictionid: string): Promise<QuestionPrediction[]> {
        return await this.connection.getRepository(QuestionPrediction)
            .createQueryBuilder('questionsprediction')
            .leftJoin('questionsprediction.prediction', 'prediction')
            .leftJoinAndSelect('questionsprediction.question', 'question')
            .where('prediction.id = :id', {id: predictionid})
            .getMany();

    }

    async createQuestionPrediction(items: CreateQuestionPredictionDto[], firebaseIdentifier): Promise<QuestionPrediction[]> {
        return await this.questionPrediction.save(items.map(p => {
            return {
                ...p,
                participant: {firebaseIdentifier}
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
