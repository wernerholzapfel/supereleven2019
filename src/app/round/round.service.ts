import {Injectable} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Round} from './round.entity';

@Injectable()
export class RoundService {

    constructor(private readonly connection: Connection,
                @InjectRepository(Round)
                private readonly repository: Repository<Round>,) {
    }

    async getNextRound(): Promise<Round> {
        return await this.connection
            .getRepository(Round)
            .createQueryBuilder('round')
            .where('\'[ ' + new Date().toISOString() + ', ' + new Date().toISOString() + ']\' ::tstzrange << round.period')
            .orderBy('round.period')
            .getOne();
    }

    async getAll(competitionid: string): Promise<Round[]> {
        return await this.connection
            .getRepository(Round)
            .createQueryBuilder('round')
            .where('round.competition.id = :competitionid', {competitionid})
            .getMany();
    }
}
