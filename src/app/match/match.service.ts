import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Connection, getConnection, InsertResult} from 'typeorm';
import {Match} from './match.entity';
import {CreateMatchDto} from './create-match.dto';
import {MatchPrediction} from '../match-prediction/match-prediction.entity';
import {CreateMatchPredictionDto} from '../match-prediction/create-match-prediction.dto';

@Injectable()
export class MatchService {
    constructor(private readonly connection: Connection) {

    }

    async findMatchesByPredictionId(predictionid: string): Promise<Match[]> {
        return await this.connection.getRepository(Match)
            .createQueryBuilder('match')
            .leftJoinAndSelect('match.competition', 'competition')
            .leftJoinAndSelect('match.prediction', 'prediction')
            .where('prediction.id = :id', {id: predictionid})
            .getMany();
    }

    async create(item: CreateMatchDto[]): Promise<InsertResult> {
        return await this.connection.getRepository(Match)
            .createQueryBuilder()
            .insert()
            .into(Match)
            .values(item)
            .returning('*')
            .execute()
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }

  }
