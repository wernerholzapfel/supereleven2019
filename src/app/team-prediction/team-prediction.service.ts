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
            .andWhere('teamPredictions.isActive')
            .getOne();

        return participant.teamPredictions;
    }

    async getStand(predictionId: string): Promise<any[]> {
        const participants: any[] = await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.teamPredictions', 'teamPredictions', 'teamPredictions.prediction.id = :predictionId', {predictionId})
            .leftJoinAndSelect('teamPredictions.teamPlayer', 'teamPlayer')
            .leftJoinAndSelect('teamPredictions.round', 'prediction_round')
            .leftJoinAndSelect('teamPredictions.tillRound', 'tillRound')
            .leftJoinAndSelect('teamPlayer.player', 'player')
            .leftJoinAndSelect('teamPlayer.teamplayerscores', 'teamplayerscores')
            .leftJoinAndSelect('teamplayerscores.round', 'score_round')
            .leftJoinAndSelect('teamPlayer.team', 'team')
            .getMany();

        return participants.map(participant => {
            return {
                ...participant,
                teamPredictions: participant.teamPredictions.map(prediction => {
                    const captainFactor = prediction.captain ? 2 : 1;
                    return {
                        ...prediction,
                        teamPlayer: {
                            ...prediction.teamPlayer,
                            teamplayerpunten: prediction.teamPlayer.teamplayerscores.map(score => {
                                return new Date(score.round.startDate) >= new Date(prediction.round.startDate)
                                && (!prediction.tillRound || new Date(score.round.startDate) < new Date(prediction.tillRound.startDate))
                                    ? {
                                        ...score,
                                        played: score.played * this.PLAYEDSCORE * captainFactor,
                                        win: score.win * this.WINSCORE * captainFactor,
                                        draw: score.draw * this.DRAWSCORE * captainFactor,
                                        yellow: score.yellow * this.YELLOWSCORE * captainFactor,
                                        secondyellow: score.secondyellow * this.SECNDYELLOWSCORE * captainFactor,
                                        red: score.red * this.REDSCORE * captainFactor,
                                        penaltymissed: score.penaltymissed * this.PENALTYMISSED * captainFactor,
                                        owngoal: score.owngoal * this.OWNGOAL * captainFactor,
                                        cleansheet: this.determineCleansheet(prediction.teamPlayer.position, score.cleansheet) * captainFactor,
                                        goals: this.determineGoals(prediction.teamPlayer.position, score.goals) * captainFactor,
                                        assists: this.determineAssists(prediction.teamPlayer.position, score.assists) * captainFactor,
                                        penaltystopped: this.determinePenaltyStopped(prediction.teamPlayer.position, score.penaltystopped) * captainFactor,
                                    }
                                    : 0
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
                            totaalpuntenspeler: prediction.teamPlayer.teamplayerpunten.reduce((totalPoints, punten) => {
                                return totalPoints + punten.totaal;
                            }, 0)
                        }
                    }
                })
            }
        }).map(participant => {
            return {
                ...participant,
                totaalpunten: participant.teamPredictions.reduce((totalPoints, player) => {
                    return totalPoints + player.teamPlayer.totaalpuntenspeler;
                }, 0)
            }
        })
    }


    determineCleansheet(position: string, cleansheet): number {
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
                return 0;

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
                return 0;
        }
    }

    determinePenaltyStopped(position: string, penaltyStopped) {
        switch (position) {
            case Position.Keeper: {
                return penaltyStopped * this.PENALTYSTOPPED
            }
            default:
                return 0;

        }
    }

    async create(teamPredictions: CreateTeamPredictionDto[], firebaseIdentifier: string): Promise<Teamprediction[] | Observable<void>> {

        const nextRound = await this.roundService.getNextRound();

        const currentTeam = await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.teamPredictions', 'teamPredictions', 'teamPredictions.prediction.id = :predictionId', {predictionId: teamPredictions[0].prediction.id})
            .leftJoinAndSelect('teamPredictions.teamPlayer', 'teamPlayer')
            .leftJoinAndSelect('teamPlayer.player', 'player')
            .leftJoinAndSelect('teamPlayer.team', 'team')
            .leftJoinAndSelect('teamPredictions.round', 'round')
            .where('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .getOne();

        const previousActivePlayers = currentTeam.teamPredictions
            .filter(currentpl => currentpl.isActive)
            .map(ap => {
                if (!teamPredictions.find(tp => tp.teamPlayer.id === ap.teamPlayer.id && ap.isActive)) {
                    return {
                        ...ap,
                        isActive: false
                    }
                } else {
                    return {
                        ...ap,
                    }
                }
            });


        const currentCaptain = currentTeam.teamPredictions.find(player => player.captain);
        const newCaptain = teamPredictions.find(player => player.captain);

        // filter form with previousactiveplayers so only new players are left over.
        const newPlayers = teamPredictions.reduce((unique, item) => {
            return previousActivePlayers
                .filter(pap => pap.isActive)
                .find(
                    ap => ap.teamPlayer.id === item.teamPlayer.id) ?
                unique :
                [...unique, item]
        }, []);

        // get the id's of the previousactiveplayers that needs to be set to inactive.
        const idsToBeupdated = [...previousActivePlayers
            .filter(pap => !pap.isActive)
            .map(item => item.id)];

        if (newPlayers.length + currentTeam.teamPredictions.length > 17) {
            throw new HttpException({
                message: `Je mag nog ${17 - currentTeam.teamPredictions.length} transfers doorvoeren`,
                statusCode: HttpStatus.FORBIDDEN,
            }, HttpStatus.FORBIDDEN);
        }

        return await getManager().transaction(async transactionalEntityManager => {
            if (idsToBeupdated.length > 0) //set inactive
            {
                await transactionalEntityManager.getRepository(Teamprediction)
                    .createQueryBuilder()
                    .update(Teamprediction)
                    .set({isActive: false, tillRound: nextRound})
                    .where('id IN (:...id)', {id: idsToBeupdated})
                    .execute();
            }
            if (currentCaptain.teamPlayer.id !== newCaptain.teamPlayer.id) {
                await transactionalEntityManager.getRepository(Teamprediction)
                    .createQueryBuilder()
                    .update(Teamprediction)
                    .set({captain: true})
                    .where('teamPlayer.id = :newCaptainId', {newCaptainId: newCaptain.teamPlayer.id})
                    .execute();

                await transactionalEntityManager.getRepository(Teamprediction)
                    .createQueryBuilder()
                    .update(Teamprediction)
                    .set({captain: false})
                    .where('teamPlayer.id = :currentCaptainId', {currentCaptainId: currentCaptain.teamPlayer.id})
                    .execute();
            }

            return await transactionalEntityManager.getRepository(Teamprediction)
                .save([
                    ...newPlayers.map(p => {
                        return {
                            ...p,
                            round: {id: nextRound.id},
                            participant: {firebaseIdentifier: firebaseIdentifier}
                        }
                    }),
                ])
                .catch((err) => {
                    throw new HttpException({
                        message: err.message,
                        statusCode: HttpStatus.BAD_REQUEST,
                    }, HttpStatus.BAD_REQUEST);
                });
        })
    }
}
