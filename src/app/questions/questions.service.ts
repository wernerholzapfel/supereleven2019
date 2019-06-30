import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
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

}
