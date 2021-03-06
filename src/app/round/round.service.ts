import {Injectable} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Round} from './round.entity';

@Injectable()
export class RoundService {

    constructor(private readonly connection: Connection,
                @InjectRepository(Round)
                private readonly repository: Repository<Round>) {
    }

    async getRound(roundnummer: string): Promise<Round> {
        return await this.connection.getRepository(Round).createQueryBuilder('round')
            .where('round.name = :roundName', {roundName: roundnummer})
            .getOne();
    }

    async getNextRound(): Promise<Round> {
        return await this.connection
            .getRepository(Round)
            .createQueryBuilder('round')
            .where('\'[ ' + new Date().toISOString() + ', ' + new Date().toISOString() + ']\' ::tstzrange << round.period')
            .orderBy('round.period')
            .getOne();
    }

    async getPreviousRound(): Promise<Round> {
        return await this.connection
            .getRepository(Round)
            .createQueryBuilder('round')
            .where('round.period ::tstzrange @> \'[ ' + new Date().toISOString() + ', ' + new Date().toISOString() + ']\'')
            .orWhere('\'[ ' + new Date().toISOString() + ', ' + new Date().toISOString() + ']\' ::tstzrange >> round.period')
            .orderBy('round.period', 'DESC')
            .getOne();
    }

    async getPreviousRounds(): Promise<Round[]> {
        return await this.connection
            .getRepository(Round)
            .createQueryBuilder('round')
            .where('round.period ::tstzrange @> \'[ ' + new Date().toISOString() + ', ' + new Date().toISOString() + ']\'')
            .orWhere('\'[ ' + new Date().toISOString() + ', ' + new Date().toISOString() + ']\' ::tstzrange >> round.period')
            .orderBy('round.period', 'DESC')
            .getMany();
    }

    async getAll(competitionid: string): Promise<Round[]> {
        return await this.connection
            .getRepository(Round)
            .createQueryBuilder('round')
            .leftJoinAndSelect('round.competition', 'competition')
            .where('competition.id = :competitionid', {competitionid})
            .orderBy('round.period')
            .getMany();
    }
}
