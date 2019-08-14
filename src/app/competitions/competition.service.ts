import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {Competition} from './competition.entity';
import {CreateCompetitionDto} from './create-competition.dto';

@Injectable()
export class CompetitionService {
    private readonly logger = new Logger('CompetitionService', true);

    constructor(private readonly connection: Connection,
                @InjectRepository(Competition)
                private readonly repository: Repository<Competition>,) {
    }

    async getAll(): Promise<Competition[]> {
        return await this.connection
            .getRepository(Competition)
            .createQueryBuilder('competition')
            .leftJoinAndSelect('competition.predictions', 'predictions')
            .leftJoinAndSelect('predictions.rounds', 'rounds')
            .leftJoinAndSelect('competition.participants', 'participants')
            .orderBy('rounds.startDate')
            .getMany();
    }

    async create(competition: CreateCompetitionDto): Promise<Competition> {
        return await this.repository.save(competition)
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }
}
