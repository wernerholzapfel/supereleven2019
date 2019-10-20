import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {RankingTeam} from './rankingTeam.entity';
import {CreateRankingTeamDto} from './create-rankingTeam.dto';

@Injectable()
export class RankingTeamService {
    private readonly logger = new Logger('RankingTeamService', true);

    constructor(private readonly connection: Connection,
                @InjectRepository(RankingTeam)
                private readonly repository: Repository<RankingTeam>,) {
    }

    async getRankingResultsByCompetitionId(competitionid): Promise<RankingTeam[]> {
        return await this.connection
            .getRepository(RankingTeam)
            .createQueryBuilder('rankingTeam')
            .leftJoinAndSelect('rankingTeam.competition', 'competition')
            .leftJoinAndSelect('rankingTeam.prediction', 'prediction')
            .leftJoinAndSelect('rankingTeam.team', 'team')
            .where('competition.id = :id', {id: competitionid})
            .orderBy('rankingTeam.position')
            .addOrderBy('team.name')
            .getMany();

    }
        async getAllByCompetitionId(competitionid): Promise<RankingTeam[]> {
        const dbResult = await this.connection
            .getRepository(RankingTeam)
            .createQueryBuilder('rankingTeam')
            .leftJoinAndSelect('rankingTeam.competition', 'competition')
            .leftJoinAndSelect('rankingTeam.prediction', 'prediction')
            .leftJoinAndSelect('rankingTeam.team', 'team')
            .where('competition.id = :id', {id: competitionid})
            .getMany();

        return dbResult.map(item => {
            return {
                ...item,
                team: {
                    ...item.team,
                    id: item.id // set rankingTeam id io teamid.
                }
            }
        }).sort((a, b) => {
            if (a.team.name < b.team.name) {
                return -1;
            }
            if (a.team.name > b.team.name) {
                return 1;
            }
            return 0;
        });
    }

    async create(dummy: CreateRankingTeamDto[]): Promise<RankingTeam[]> {
        return await this.repository.save(dummy)
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }
}
