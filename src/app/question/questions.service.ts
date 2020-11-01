import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Connection, Repository, UpdateResult} from 'typeorm';
import {Question} from './question.entity';
import {CreateQuestionDto} from './create-question.dto';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class QuestionsService {

    constructor(private connection: Connection,
                @InjectRepository(Question)
                private readonly questionRepo: Repository<Question>) {
    }

    async findQuestionsByPredictionId(predictionid: string): Promise<Question[]> {
        return await this.connection.getRepository(Question)
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.competition', 'competition')
            .leftJoinAndSelect('question.prediction', 'prediction')
            .leftJoinAndSelect('question.round', 'round')
            .where('prediction.id = :id', {id: predictionid})
            .getMany();
    }

    async create(item: CreateQuestionDto[]): Promise<Question[]> {
        return await this.questionRepo.save(item)
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }

    async updateQuestion(body: {questionId: string, answer: string, roundId: string}): Promise<UpdateResult> {
            return await this.connection.getRepository(Question)
            .createQueryBuilder('question')
            .update(Question)
            .set({answer: body.answer, round: {id: body.roundId}})
            .where('id = :questionId', {questionId: body.questionId})
            .execute();
    }

}
