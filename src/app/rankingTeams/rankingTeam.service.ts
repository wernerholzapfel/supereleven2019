import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {RankingTeam} from './rankingTeam.entity';
import {CreateRankingTeamDto} from './create-rankingTeam.dto';

@Injectable()
export class RankingTeamService {
    private readonly logger = new Logger('DummyService', true);

    constructor(private readonly connection: Connection,
                @InjectRepository(RankingTeam)
                private readonly repository: Repository<RankingTeam>,) {
    }

    async getAll(): Promise<RankingTeam[]> {
        return await this.connection
            .getRepository(RankingTeam)
            .createQueryBuilder('dummy')
            .getMany();
    }

    async create(dummy: CreateRankingTeamDto): Promise<RankingTeam> {
        return await this.repository.save(dummy)
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }
}
