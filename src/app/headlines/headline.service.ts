import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {Headline} from './headline.entity';
import {CreateHeadlineDto} from './create-headline.dto';

@Injectable()
export class HeadlineService {
    private readonly logger = new Logger('HeadlineService', true);

    constructor(private readonly connection: Connection,
                @InjectRepository(Headline)
                private readonly headlineRepository: Repository<Headline>,) {
    }

    async findAllByTourId(competitionId: string): Promise<Headline[]> {
        return await this.connection
            .getRepository(Headline)
            .createQueryBuilder('headline')
            .leftJoin('headline.competition', 'competition')
            .where('competition.id = :competitionId', {competitionId})
            .orderBy('headline.updatedDate', 'DESC')
            .getMany();
    }


    async create(headline: CreateHeadlineDto): Promise<Headline> {
        return await this.headlineRepository.save(headline)
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }
}
