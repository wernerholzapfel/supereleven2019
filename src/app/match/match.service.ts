import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Connection, getConnection, InsertResult, Repository} from 'typeorm';
import {Match} from './match.entity';
import {CreateMatchDto} from './create-match.dto';
import {MatchPrediction} from '../match-prediction/match-prediction.entity';
import {CreateMatchPredictionDto} from '../match-prediction/create-match-prediction.dto';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class MatchService {
    constructor(private readonly connection: Connection,
                @InjectRepository(Match)
                private readonly matchRepo: Repository<Match>
                ) {

    }

    async findMatchesByPredictionId(predictionid: string): Promise<Match[]> {
        return await this.connection.getRepository(Match)
            .createQueryBuilder('match')
            .leftJoinAndSelect('match.competition', 'competition')
            .leftJoinAndSelect('match.prediction', 'prediction')
            .leftJoinAndSelect('match.round', 'round')
            .where('prediction.id = :id', {id: predictionid})
            .orderBy('match.date')
            .getMany();
    }

    async create(item: CreateMatchDto): Promise<Match> {
        return await this.matchRepo.save(item)
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }
    //     return await this.connection.getRepository(Match)
    //         .createQueryBuilder()
    //         .insert()
    //         .into(Match)
    //         .values(item)
    //         .returning('*')
    //         .execute()
    //         .catch((err) => {
    //             throw new HttpException({
    //                 message: err.message,
    //                 statusCode: HttpStatus.BAD_REQUEST,
    //             }, HttpStatus.BAD_REQUEST);
    //         });
    // }

  }
