import {Injectable} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Teamplayer, TeamplayerResponse} from './teamplayer.entity';
import {TeamPredictionService} from '../team-prediction/team-prediction.service';

@Injectable()
export class TeamPlayerService {
    constructor(private readonly connection: Connection,
                @InjectRepository(Teamplayer)
                private readonly repository: Repository<Teamplayer>, private teampredictionService: TeamPredictionService) {
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

    async getStats(predictionId: string) {
        const teamplayers = await this.connection
            .getRepository(Teamplayer)
            .createQueryBuilder('teamplayers')
            .leftJoin('teamplayers.prediction', 'prediction')
            .leftJoinAndSelect('teamplayers.player', 'player')
            .leftJoinAndSelect('teamplayers.team', 'team')
            .leftJoinAndSelect('teamplayers.teamPredictions', 'teamPredictions')
            .leftJoinAndSelect('teamplayers.teamplayerscores', 'teamplayerscores')
            .leftJoinAndSelect('teamPredictions.participant', 'participant')
            .where('teamplayers.isSelected')
            .andWhere('prediction.id = :id', {id: predictionId})
            .getMany();

        const stand = teamplayers
            .map(teamPlayer => {
                return {
                    ...teamPlayer,
                    teamplayerpunten: teamPlayer.teamplayerscores.map(score => {
                        return {
                            ...score,
                            played: score.played ? this.teampredictionService.PLAYEDSCORE : 0,
                            win: score.win ? this.teampredictionService.WINSCORE : 0,
                            draw: score.draw ? this.teampredictionService.DRAWSCORE : 0,
                            yellow: score.yellow ? this.teampredictionService.YELLOWSCORE : 0,
                            secondyellow: score.secondyellow ? this.teampredictionService.SECNDYELLOWSCORE : 0,
                            red: score.red ? this.teampredictionService.REDSCORE : 0,
                            penaltymissed: score.penaltymissed * this.teampredictionService.PENALTYMISSED,
                            owngoal: score.owngoal * this.teampredictionService.OWNGOAL,
                            cleansheet: this.teampredictionService.determineCleansheet(teamPlayer.position, score.cleansheet),
                            goals: this.teampredictionService.determineGoals(teamPlayer.position, score.goals),
                            assists: this.teampredictionService.determineAssists(teamPlayer.position, score.assists),
                            penaltystopped: this.teampredictionService.determinePenaltyStopped(teamPlayer.position, score.penaltystopped),
                        }
                    }).map(punten => {
                        return {
                            ...punten,
                            totaal: Object.entries(punten).reduce(function (total, pair: [string, number]) {
                                const [key, value] = pair;
                                return typeof value == 'number' ? total + value : total;
                            }, 0)
                        }
                    }),
                }
            }).map(teamPlayer => {
                return {
                    ...teamPlayer,
                    teamplayertotaalpunten: this.teampredictionService.calculateTeamplayerTotaalPunten(teamPlayer.teamplayerpunten),
                }
            })
        .sort((a, b) => {
                    const x = b.teamplayertotaalpunten.totaal;
                    const y = a.teamplayertotaalpunten.totaal;
                    return x < y ? -1 : x > y ? 1 : 0
                });

        return stand;
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
