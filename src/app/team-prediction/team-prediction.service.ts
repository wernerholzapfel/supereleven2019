import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Connection, getManager, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Teamprediction} from './team-prediction.entity';
import {CreateTeamPredictionDto} from './create-team-prediction.dto';
import {Participant} from '../participant/participant.entity';
import {RoundService} from '../round/round.service';
import {Observable} from 'rxjs';
import {Position} from '../team-player/teamplayer.entity';

@Injectable()
export class TeamPredictionService {
    private readonly logger = new Logger('TeamPredictionService', true);

    PLAYEDSCORE = 1;
    WINSCORE = 2;
    DRAWSCORE = 1;
    YELLOWSCORE = -2;
    SECNDYELLOWSCORE = 6;
    REDSCORE = -8;
    PENALTYMISSED = -4;
    PENALTYSTOPPED = 6;
    OWNGOAL = -4;
    CLEANSHEET = -2;

    constructor(private readonly connection: Connection,
                @InjectRepository(Teamprediction)
                private readonly repository: Repository<Teamprediction>,
                private readonly roundService: RoundService) {
    }

    async getAll(predictionId: string, firebaseIdentifier: string): Promise<Teamprediction[]> {
        const participant = await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.teamPredictions', 'teamPredictions', 'teamPredictions.prediction.id = :predictionId', {predictionId})
            .leftJoinAndSelect('teamPredictions.teamPlayer', 'teamPlayer')
            .leftJoinAndSelect('teamPlayer.player', 'player')
            .leftJoinAndSelect('teamPlayer.team', 'team')
            .where('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .getOne();

        return participant.teamPredictions;
    }

    async getStand(predictionId: string): Promise<any[]> {
        const participants: any[] = await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.teamPredictions', 'teamPredictions', 'teamPredictions.prediction.id = :predictionId', {predictionId})
            .leftJoinAndSelect('teamPredictions.teamPlayer', 'teamPlayer')
            .leftJoinAndSelect('teamPlayer.player', 'player')
            .leftJoinAndSelect('teamPlayer.teamplayerscores', 'teamplayerscores')
            .leftJoinAndSelect('teamplayerscores.round', 'round')
            .leftJoinAndSelect('teamPlayer.team', 'team')
            .getMany();

        return participants.map(participant => {
            return {
                ...participant,
                teamPredictions: participant.teamPredictions.map(prediction => {
                    return {
                        ...prediction,
                        teamPlayer: {
                            ...prediction.teamPlayer,
                            teamplayerpunten: prediction.teamPlayer.teamplayerscores.map(score => {
                                return {
                                    ...score,
                                    played: score.played * this.PLAYEDSCORE,
                                    win: score.win * this.WINSCORE,
                                    draw: score.draw * this.DRAWSCORE,
                                    yellow: score.yellow * this.YELLOWSCORE,
                                    secondyellow: score.secondyellow * this.SECNDYELLOWSCORE,
                                    red: score.red * this.REDSCORE,
                                    penaltymissed: score.penaltymissed * this.PENALTYMISSED,
                                    owngoal: score.owngoal * this.OWNGOAL,
                                    cleansheet: this.determineCleansheet(prediction.teamPlayer.position, score.cleansheet),
                                    goals: this.determineGoals(prediction.teamPlayer.position, score.goals),
                                    assists: this.determineAssists(prediction.teamPlayer.position, score.assists),
                                    penaltystopped: this.determinePenaltyStopped(prediction.teamPlayer.position, score.penaltystopped),
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
                    }
                }).map(prediction => {
                    return {
                        ...prediction,
                        teamPlayer: {
                            ...prediction.teamPlayer,
                            totaalpunten: prediction.teamPlayer.teamplayerpunten.reduce((totalPoints, punten) => {
                                return totalPoints + punten.totaal;
                            }, 0)
                        }
                    }
                })
            }
        })
    }


    determineCleansheet(position: string, cleansheet) {
        switch (position) {
            case Position.Keeper: {
                return cleansheet * this.CLEANSHEET * 2
            }
            case Position.Defender: {
                return cleansheet * this.CLEANSHEET

            }
            default:
                return 0

        }
    }
    determineGoals(position: string, goals) {
        this.logger.log(position);
        this.logger.log(goals);
        switch (position) {
            case Position.Keeper: {
                return goals * 10
            }
            case Position.Defender: {
                return goals * 6
            }
            case Position.Midfielder: {
                return goals * 4
            }
            case Position.Forward: {
                return goals * 3
            }
            default:
                0

        }
    }
    determineAssists(position: string, assists) {
        switch (position) {
            case Position.Keeper: {
                return assists * 8
            }
            case Position.Defender: {
                return assists * 4
            }
            case Position.Midfielder: {
                return assists * 3
            }
            case Position.Forward: {
                return assists * 2
            }
            default:
                0

        }
    }

    determinePenaltyStopped(position: string, penaltyStopped) {
        switch (position) {
            case Position.Keeper: {
                return penaltyStopped * this.PENALTYSTOPPED
            }
            default:
                0

        }
    }

    async create(teamPredictions: CreateTeamPredictionDto[], firebaseIdentifier: string): Promise<Teamprediction[] | Observable<void>> {

        const nextRound = await this.roundService.getNextRound();
        this.logger.log(nextRound);
        this.logger.log(teamPredictions);
        return await getManager().transaction(async transactionalEntityManager => {
            await transactionalEntityManager
                .getRepository(Teamprediction)
                .createQueryBuilder()
                .delete()
                .from(Teamprediction)
                .where('round.id = :roundId', {roundId: nextRound.id})
                .andWhere('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
                .execute();
            return await transactionalEntityManager.getRepository(Teamprediction)
                .save(teamPredictions.map(p => {
                    return {
                        ...p,
                        round: {id: nextRound.id},
                        participant: {firebaseIdentifier: firebaseIdentifier}
                    }
                }))
                .catch((err) => {
                    throw new HttpException({
                        message: err.message,
                        statusCode: HttpStatus.BAD_REQUEST,
                    }, HttpStatus.BAD_REQUEST);
                });

        })
    }
}
