import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {RankingPrediction} from './rankingPredictions.entity';
import {CreateRankingPredictionsDto} from './create-rankingPredictions.dto';
import {Participant} from '../participant/participant.entity';

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

    async findAllByCompetitionId(competitionid: string, email: string): Promise<RankingPrediction[]> {
        const rankingPrediction: RankingPrediction[] = await this.connection
            .getRepository(RankingPrediction)
            .createQueryBuilder('rankingPrediction')
            .leftJoin('rankingPrediction.participant', 'participant')
            .leftJoin('rankingPrediction.competition', 'competition')
            .leftJoinAndSelect('rankingPrediction.team', 'rankingTeam')
            .leftJoinAndSelect('rankingTeam.team', 'team')
            .where('participant.email = :email', {email: email.toLowerCase()})
            .andWhere('competition.id = :id', {id: competitionid})
            .orderBy('rankingPrediction.position')
            .getMany();

        return rankingPrediction.map(item => {
            return {
                ...item, team: {
                    ...item.team,
                    name: item.team.team.name,
                    logoUrl: item.team.team.logoUrl
                }
            };
        })
    }

    async create(rankingPredictions: CreateRankingPredictionsDto[], firebaseIdentifier): Promise<RankingPrediction[]> {

        const participant = await this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .where('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .getOne();

        return await this.rankingPrediction.save(rankingPredictions.map(p => {
            return {
                ...p,
                participant
            }
        }))
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }
}
