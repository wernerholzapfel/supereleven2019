import {Injectable} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Teamplayer, TeamplayerResponse} from './teamplayer.entity';

@Injectable()
export class TeamPlayerService {
    constructor(private readonly connection: Connection,
                @InjectRepository(Teamplayer)
                private readonly repository: Repository<Teamplayer>,) {
    }

    async getAllByPredictionId(predictionId: string): Promise<Teamplayer[]> {
        return await this.connection
            .getRepository(Teamplayer)
            .createQueryBuilder('teamplayers')
            .leftJoinAndSelect('teamplayers.player', 'player')
            .leftJoinAndSelect('teamplayers.team', 'team')
            .leftJoin('teamplayers.prediction', 'prediction')
            .where('prediction.id = :id', {id: predictionId})
            .andWhere('teamplayers.active')
            .orderBy('team.name')
            .addOrderBy('player.position')
            .addOrderBy('player.name')
            .getMany();
    }

    async getTeamplayersWithScoresForRound(predictionId: string, roundId: string): Promise<TeamplayerResponse[]> {
        const list = await this.connection
            .getRepository(Teamplayer)
            .createQueryBuilder('teamplayers')
            .leftJoinAndSelect('teamplayers.player', 'player')
            .leftJoinAndSelect('teamplayers.team', 'team')
            .leftJoin('teamplayers.prediction', 'prediction')
            .leftJoinAndSelect('teamplayers.teamplayerscores', 'teamplayerscores', 'teamplayerscores.round = :roundId', {roundId})
            .leftJoinAndSelect('teamplayerscores.round', 'round')
            .where('prediction.id = :id', {id: predictionId})
            .orderBy('team.name')
            .addOrderBy('player.position')
            .addOrderBy('player.name')
            .getMany();

        return list.map(player => {
            return {
                ...player,
                teamplayerscores: player.teamplayerscores[0] ? player.teamplayerscores[0] : {
                    played: false,
                    win: false,
                    draw: false,
                    cleansheet: false,
                    yellow: false,
                    secondyellow: false,
                    red: false,
                    goals: 0,
                    assists: 0,
                    penaltymissed: 0,
                    penaltystopped: 0,
                    owngoal: 0
                    }
            }
        })
    }

}
