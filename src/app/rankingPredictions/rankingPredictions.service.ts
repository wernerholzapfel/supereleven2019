import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {RankingPrediction} from './rankingPredictions.entity';
import {CreateRankingPredictionsDto} from './create-rankingPredictions.dto';

@Injectable()
export class RankingPredictionsService {
    private readonly logger = new Logger('RankinkpredictionsService', true);

    constructor(private readonly connection: Connection,
                @InjectRepository(RankingPrediction)
                private readonly rankingPrediction: Repository<RankingPrediction>,) {
    }

    async getAll(): Promise<RankingPrediction[]> {
        return await this.connection
            .getRepository(RankingPrediction)
            .createQueryBuilder('rankingPrediction')
            .leftJoinAndSelect('rankingPrediction.team', 'team')
            .getMany();
    }
    async findAllById(id: string): Promise<RankingPrediction[]> {
        return await this.connection
            .getRepository(RankingPrediction)
            .createQueryBuilder('rankingPrediction')
            .leftJoin('rankingPrediction.competition', 'competition')
            .leftJoinAndSelect('rankingPrediction.team', 'team')
            .where('competition.id = :id', {id})
            // .orderBy('headline.updatedDate', 'DESC')
            .getMany();
    }


    async create(rankingPrediction: CreateRankingPredictionsDto[]): Promise<RankingPrediction[]> {
        return await this.rankingPrediction.save(rankingPrediction)
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }
}
