import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {CreatePredictionDto} from './create-prediction.dto';
import {Prediction} from './prediction.entity';

@Injectable()
export class PredictionService {
    private readonly logger = new Logger('PredictionService', true);

    constructor(private readonly connection: Connection,
                @InjectRepository(Prediction)
                private readonly repository: Repository<Prediction>,) {
    }

    async getAll(): Promise<Prediction[]> {
        return await this.connection
            .getRepository(Prediction)
            .createQueryBuilder('prediction')
            .getMany();
    }


    async create(prediction: CreatePredictionDto): Promise<Prediction> {
        return await this.repository.save(prediction)
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }
}
