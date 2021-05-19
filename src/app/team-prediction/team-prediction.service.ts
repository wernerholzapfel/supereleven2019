import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Connection, getManager, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Teamprediction} from './team-prediction.entity';
import {CreateTeamPredictionDto} from './create-team-prediction.dto';
import {Participant} from '../participant/participant.entity';
import {RoundService} from '../round/round.service';
import {Observable} from 'rxjs';
import {Position, Teamplayer} from '../team-player/teamplayer.entity';
import {Round} from '../round/round.entity';
import admin from 'firebase-admin';
import {PredictionType} from '../prediction/create-prediction.dto';

@Injectable()
export class TeamPredictionService {
    private readonly logger = new Logger('TeamPredictionService', true);

    PLAYEDSCORE = 1;
    WINSCORE = 2;
    DRAWSCORE = 1;
    YELLOWSCORE = -2;
    SECNDYELLOWSCORE = -6;
    REDSCORE = -8;
    PENALTYMISSED = -4;
    PENALTYSTOPPED = 6;
    OWNGOAL = -4;
    CLEANSHEET = 2;

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
            .leftJoinAndSelect('teamPredictions.round', 'round')
            .leftJoinAndSelect('teamPlayer.player', 'player')
            .leftJoinAndSelect('teamPlayer.team', 'team')
            .where('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .andWhere('teamPredictions.isActive')
            .getOne();

        return participant ? participant.teamPredictions : [];
    }

    async getRoundStand(predictionId: string, roundId: string) {
        const rounds: Round[] = await this.connection.getRepository(Round).createQueryBuilder('round')
            .leftJoin('round.prediction', 'prediction')
            .where('prediction.id = :predictionId', {predictionId})
            .orderBy('round.startDate')
            .getMany();

        const roundIndex = rounds.findIndex(round => round.id === roundId);
        const enddate: Date = roundIndex + 1 === rounds.length ? new Date() : rounds[roundIndex + 1].startDate;

        const participants: any[] = await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.teamPredictions', 'teamPredictions')
            .leftJoinAndSelect('teamPredictions.teamPlayer', 'teamPlayer')
            .leftJoinAndSelect('teamPredictions.round', 'prediction_round')
            .leftJoinAndSelect('teamPredictions.tillRound', 'tillRound')
            .leftJoinAndSelect('teamPredictions.captainTillRound', 'captainTillRound')
            .leftJoinAndSelect('teamPlayer.player', 'player')
            .leftJoinAndSelect('teamPlayer.teamplayerscores', 'teamplayerscores', 'teamplayerscores.round.id = :roundId', {
                roundId,
            })
            .leftJoinAndSelect('teamplayerscores.round', 'score_round')
            .leftJoinAndSelect('teamPlayer.team', 'team')
            .where(qb => {
                const subQuery = qb.subQuery()
                    .select('round.id')
                    .from(Round, 'round')
                    .where('round.startDate <= :startdate', {startdate: rounds[roundIndex].startDate})
                    .getQuery();
                return 'prediction_round.id IN ' + subQuery;
            })
            .andWhere(sq => {
                const subQuery2 = sq.subQuery()
                    .select('round.id')
                    .from(Round, 'round')
                    .where('round.startDate = :enddate', {enddate})
                    .getQuery();
                return '(tillRound.id IN ' + subQuery2 + ' OR tillRound.id is null)';
            })
            .orderBy('teamPredictions.isActive', 'DESC')
            .getMany();

        return this.calculateStand(participants.map(participant => {
            return {
                ...participant,
                teamPredictions: participant.teamPredictions.map(prediction => {
                    return {
                        ...prediction,
                        isActive: true,
                    };
                }),
            };
        }));
    }

    async createRoundStand(competitionId: string, predictionId: string, roundId: string) {
        const sortedStand = await this.getRoundStand(predictionId, roundId);

        const db = admin.database();

        const docRef = db.ref(`${competitionId}/${predictionId}/${PredictionType.Team}/${roundId}`);

        docRef.set(sortedStand);

        return sortedStand;
    }

    async getStand(predictionId: string): Promise<any[]> {

        const rounds: Round[] = await this.connection.getRepository(Round).createQueryBuilder('round')
            .leftJoin('round.prediction', 'prediction')
            .where('prediction.id = :predictionId', {predictionId})
            .orderBy('round.startDate')
            .getMany();

        const previousRound = await this.roundService.getPreviousRound();
        const nextRound = await this.roundService.getNextRound();

        this.logger.log('round is: ' + previousRound.name);
        const startDatePreviousRound: Date = previousRound && previousRound.startDate ? previousRound.startDate : new Date();

        const participants: any[] = await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.teamPredictions', 'teamPredictions', 'teamPredictions.prediction.id = :predictionId', {predictionId})
            .leftJoinAndSelect('teamPredictions.teamPlayer', 'teamPlayer')
            .leftJoinAndSelect('teamPredictions.round', 'prediction_round')
            .leftJoinAndSelect('teamPredictions.tillRound', 'tillRound')
            .leftJoinAndSelect('teamPredictions.captainTillRound', 'captainTillRound')
            .leftJoinAndSelect('teamPlayer.player', 'player')
            .leftJoinAndSelect('teamPlayer.teamplayerscores', 'teamplayerscores')
            .leftJoinAndSelect('teamplayerscores.round', 'score_round')
            .leftJoinAndSelect('teamPlayer.team', 'team')
            .where(qb => {
                const subQuery = qb.subQuery()
                    .select('round.id')
                    .from(Round, 'round')
                    .where('round.startDate <= :startdate', {startdate: startDatePreviousRound})
                    .getQuery();
                return 'prediction_round.id IN ' + subQuery;
            })
            .orderBy('teamPredictions.isActive', 'DESC')
            .getMany();

        return this.calculateStand(participants.map(participant => {
            return {
                ...participant,
                teamPredictions: participant.teamPredictions.filter(prediction => {
                    return !prediction.tillRound ||
                        (prediction.tillRound && prediction.round.id !== prediction.tillRound.id);
                }).map(tp => {
                    return {
                        ...tp,
                        isActive: tp.isActive ? tp.isActive : tp.tillRound.id === nextRound.id,
                    };
                }),
            };
        }));
    }

    async createStand(competitionId: string, predictionId: string): Promise<any[]> {
        const sortedStand = await this.getStand(predictionId);

        const db = admin.database();

        const docRef = db.ref(`${competitionId}/${predictionId}/${PredictionType.Team}/totaal`);

        docRef.set(sortedStand);

        return sortedStand;
    }

    isCaptain(prediction, round: Round): boolean {
        return (prediction.captain && !prediction.captainTillRound) ||
            (prediction.captainTillRound && prediction.captainTillRound.startDate > round.startDate);
    }

    public calculateStand(participants: any[]) {
        this.logger.log('calculatestand');
        let previousPosition = 1;

        const stand = participants
            .map(participant => {
                return {
                    ...participant,
                    teamPredictions: participant.teamPredictions.map(prediction => {
                        return {
                            ...prediction,
                            teamPlayer: {
                                ...prediction.teamPlayer,
                                teamplayerpunten: prediction.teamPlayer.teamplayerscores.map(score => {
                                    const captainFactor = this.isCaptain(prediction, score.round) ? 2 : 1;
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
                                            penaltystopped: this.determinePenaltyStopped(prediction.teamPlayer.position,
                                                score.penaltystopped) * captainFactor,
                                        }
                                        : 0;
                                }).map(punten => {
                                    return {
                                        ...punten,
                                        totaal: Object.entries(punten).reduce((total, pair: [string, number]) => {
                                            const [key, value] = pair;
                                            return typeof value === 'number' ? total + value : total;
                                        }, 0),
                                    };
                                }),
                            },
                        };
                    }).map(prediction => {
                        return {
                            ...prediction,
                            teamPlayer: {
                                ...prediction.teamPlayer,
                                teamplayertotaalpunten: this.calculateTeamplayerTotaalPunten(prediction.teamPlayer.teamplayerpunten),
                            },
                        };
                    }).sort((a, b) => {
                        const x = this.setSortValuePosition(a.teamPlayer.position);
                        const y = this.setSortValuePosition(b.teamPlayer.position);
                        return a.isActive < b.isActive ? 1 : a.isActive > b.isActive ? -1 : x < y ? -1 : x > y ? 1 : 0;
                    }),
                };
            })
            .map(participant => {
                return {
                    ...participant,
                    totaalpunten: participant.teamPredictions.reduce((totalPoints, player) => {
                        return totalPoints + player.teamPlayer.teamplayertotaalpunten.totaal;
                    }, 0),
                };
            })
            .sort((a, b) => {
                return a.totaalpunten > b.totaalpunten ? -1 : a.totaalpunten < b.totaalpunten ? 1 : 0;
            });

        return stand.map((participant, index) => {
            if (index > 0 && participant.totaalpunten === stand[index - 1].totaalpunten) {
                return {
                    ...participant,
                    position: previousPosition,
                };
            } else {
                previousPosition = index + 1;
                return {
                    ...participant,
                    position: index + 1,
                };
            }
        });
    }

    calculateTeamplayerTotaalPunten(teamplayerpunten) {
        return {
            played: this.addReduceFunction(teamplayerpunten, 'played'),
            win: this.addReduceFunction(teamplayerpunten, 'win'),
            draw: this.addReduceFunction(teamplayerpunten, 'draw'),
            cleansheet: this.addReduceFunction(teamplayerpunten, 'cleansheet'),
            yellow: this.addReduceFunction(teamplayerpunten, 'yellow'),
            secondyellow: this.addReduceFunction(teamplayerpunten, 'secondyellow'),
            red: this.addReduceFunction(teamplayerpunten, 'red'),
            goals: this.addReduceFunction(teamplayerpunten, 'goals'),
            assists: this.addReduceFunction(teamplayerpunten, 'assists'),
            penaltymissed: this.addReduceFunction(teamplayerpunten, 'penaltymissed'),
            penaltystopped: this.addReduceFunction(teamplayerpunten, 'penaltystopped'),
            owngoal: this.addReduceFunction(teamplayerpunten, 'owngoal'),
            totaal: this.addReduceFunction(teamplayerpunten, 'totaal'),
        };
    }

    addReduceFunction(array: any[], property: string) {
        return array.reduce((totalPoints, item) => {
            return item[property] ? totalPoints + item[property] : totalPoints;
        }, 0);
    }

    private setSortValuePosition(position: string) {
        switch (position) {
            case Position.Keeper: {
                return 0;
            }
            case Position.Defender: {
                return 1;
            }
            case Position.Midfielder: {
                return 2;
            }
            case Position.Forward: {
                return 3;
            }

        }
    }

    determineCleansheet(position: string, cleansheet): number {
        switch (position) {
            case Position.Keeper: {
                return cleansheet * this.CLEANSHEET * 2;
            }
            case Position.Defender: {
                return cleansheet * this.CLEANSHEET;

            }
            default:
                return 0;

        }
    }

    determineGoals(position: string, goals) {
        switch (position) {
            case Position.Keeper: {
                return goals * 10;
            }
            case Position.Defender: {
                return goals * 6;
            }
            case Position.Midfielder: {
                return goals * 4;
            }
            case Position.Forward: {
                return goals * 3;
            }
            default:
                return 0;

        }
    }

    determineAssists(position: string, assists) {
        switch (position) {
            case Position.Keeper: {
                return assists * 8;
            }
            case Position.Defender: {
                return assists * 4;
            }
            case Position.Midfielder: {
                return assists * 3;
            }
            case Position.Forward: {
                return assists * 2;
            }
            default:
                return 0;
        }
    }

    determinePenaltyStopped(position: string, penaltyStopped) {
        switch (position) {
            case Position.Keeper: {
                return penaltyStopped * this.PENALTYSTOPPED;
            }
            default:
                return 0;

        }
    }

    async getNumberOfPossibleTransfers(predictionId: string, firebaseIdentifier: string):
        Promise<{
            numberOfPossibleTransfers: number,
            idsCurrentActivePlayers: string[],
            idCurrentCaptain: string,
        }> {

        const allPreviousPlayers = await this.connection
            .getRepository(Teamprediction)
            .createQueryBuilder('teamPredictions')
            .leftJoin('teamPredictions.participant', 'participant')
            .leftJoin('teamPredictions.prediction', 'prediction')
            .leftJoinAndSelect('teamPredictions.teamPlayer', 'teamPlayer')
            .leftJoinAndSelect('teamPlayer.player', 'player')
            .leftJoinAndSelect('teamPlayer.team', 'team')
            .leftJoinAndSelect('teamPredictions.round', 'round')
            .leftJoinAndSelect('teamPredictions.tillRound', 'tillRound')
            .leftJoinAndSelect('teamPredictions.captainTillRound', 'captainTillRound')
            .where('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .andWhere('prediction.id = :predictionId', {predictionId})
            .getMany();

        const nextRound = await this.roundService.getNextRound();

        const previousPlayers = allPreviousPlayers.filter(player => {
            return !player.tillRound ||
                (player.round.id !== player.tillRound.id &&
                    player.tillRound.id !== nextRound.id);
        });

        const idsCurrentActivePlayers = allPreviousPlayers.filter(player => {
            return (player.isActive &&
                player.round.id !== nextRound.id) ||
                (player.tillRound && player.tillRound.id === nextRound.id);
        });

        const allCaptains = allPreviousPlayers.filter(player => {
            return player.captain ||
                (!player.captain && !!player.captainTillRound && player.round.id !== player.captainTillRound.id);
        });

        const previousCaptainId = allCaptains.length > 0 ?
            allCaptains.find(captain => captain.captainTillRound && captain.captainTillRound.id === nextRound.id) ?
                allCaptains.find(captain => captain.captainTillRound.id).teamPlayer.player.id :
                allCaptains.find(captain => captain.isActive).teamPlayer.player.id :
            '';

        return {
            numberOfPossibleTransfers: 17 - previousPlayers.length,
            idsCurrentActivePlayers: idsCurrentActivePlayers.map(player => {
                return player.teamPlayer.player.id;
            }),
            idCurrentCaptain: previousCaptainId,
        };

    }

    async create(newTeam: CreateTeamPredictionDto[], firebaseIdentifier: string): Promise<Teamprediction[] | Observable<void>> {

        const participant = await this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .where('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .getOne();

        // throw participant not found?

        const nextRound = await this.roundService.getNextRound();

        const allPreviousPlayers = await this.connection
            .getRepository(Teamprediction)
            .createQueryBuilder('teamPredictions')
            .leftJoin('teamPredictions.participant', 'participant')
            .leftJoin('teamPredictions.prediction', 'prediction')
            .leftJoinAndSelect('teamPredictions.teamPlayer', 'teamPlayer')
            .leftJoinAndSelect('teamPlayer.player', 'player')
            .leftJoinAndSelect('teamPlayer.team', 'team')
            .leftJoinAndSelect('teamPredictions.round', 'round')
            .leftJoinAndSelect('teamPredictions.tillRound', 'tillRound')
            .where('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .andWhere('prediction.id = :predictionId', {predictionId: newTeam[0].prediction.id})
            .getMany();

        const previousTeam = allPreviousPlayers
            .filter(currentpl => currentpl.isActive)
            .map(CurrentActivePlayer => {
                if (newTeam.find(tp => tp.teamPlayer.id === CurrentActivePlayer.teamPlayer.id && CurrentActivePlayer.isActive)) {
                    return {
                        ...CurrentActivePlayer,
                    };
                } else {
                    return {
                        ...CurrentActivePlayer,
                        isActive: false,
                    };
                }
            });

        const currentCaptain = allPreviousPlayers.find(player => player.captain && player.isActive);
        const newCaptain =
            !currentCaptain ||
            currentCaptain.teamPlayer.id !== newTeam.find(player => player.captain).teamPlayer.id ?
                newTeam.find(player => player.captain)
                : null;

        // filter form with previousteam so only new players are left over.
        let newPlayers = newTeam.reduce((unique, item) => {
            return previousTeam
                .filter(previousPlayer => previousPlayer.isActive)
                .find(ap => ap.teamPlayer.id === item.teamPlayer.id)
                ? unique
                : [...unique, item];
        }, []);

        const existingPlayerThatBecomesCaptain = newCaptain ?
            allPreviousPlayers.find(player => player.teamPlayer.id === newCaptain.teamPlayer.id) : null;

        // get the id's of the previousactiveplayers that needs to be set to inactive.
        const idsToBeSetInActive = [...previousTeam
            .filter(previousPlayers => !previousPlayers.isActive)
            .map(item => item.id)];

        const previousNumberOfPlayers = allPreviousPlayers.filter(player => {
            return !player.tillRound || player.round.id !== player.tillRound.id;
        }).length;

        if (newPlayers.length + previousNumberOfPlayers > 17) {
            throw new HttpException({
                message: `Je mag nog ${17 - previousNumberOfPlayers} transfers doorvoeren`,
                statusCode: HttpStatus.FORBIDDEN,
            }, HttpStatus.FORBIDDEN);
        }

        return await getManager().transaction(async transactionalEntityManager => {
            if (idsToBeSetInActive.length > 0) // set inactive
            {
                await transactionalEntityManager.getRepository(Teamprediction)
                    .createQueryBuilder()
                    .update(Teamprediction)
                    .set({isActive: false, tillRound: nextRound})
                    .where('id IN (:...id)', {id: idsToBeSetInActive})
                    .execute();
            }
            if (newCaptain) {
                newPlayers = [...newPlayers.filter(np => !np.captain), newCaptain];
                if (existingPlayerThatBecomesCaptain) {
                    // zet oude speler op inactief indien nieuwe captain toegevoegd gaat worden
                    await transactionalEntityManager.getRepository(Teamprediction)
                        .createQueryBuilder('teamPrediction')
                        .update(Teamprediction)
                        .set({isActive: false, tillRound: nextRound})
                        .where('"teamPlayerId" = :newCaptainTeamPlayerId', {newCaptainTeamPlayerId: existingPlayerThatBecomesCaptain.teamPlayer.id})
                        .andWhere('"participantId" = :participantId', {participantId: participant.id})
                        .execute();
                }
                if (currentCaptain) {
                    // current captain wordt captain af
                    await transactionalEntityManager.getRepository(Teamprediction)
                        .createQueryBuilder('teamPrediction')
                        .leftJoin('teamPrediction.participant', 'participant')
                        .leftJoin('teamPrediction.teamPlayer', 'teamPlayer')
                        .update(Teamprediction)
                        .set({captain: false, captainTillRound: nextRound})
                        .where('"id" = :currentCaptainId', {currentCaptainId: currentCaptain.id})
                        .andWhere('"participantId" = :participantId', {participantId: participant.id})
                        .execute();
                }

                await transactionalEntityManager.getRepository(Teamplayer)
                    .createQueryBuilder('teamplayer')
                    .update(Teamplayer)
                    .set({isSelected: true})
                    .where('"id" IN (:...teamplayerIds)',
                        {teamplayerIds: newPlayers.map(np => np.teamPlayer.id)})
                    .execute();
            }
            return await transactionalEntityManager.getRepository(Teamprediction)
                .save([
                    ...newPlayers.map(p => {
                        return {
                            ...p,
                            round: {id: nextRound.id},
                            participant,
                        };
                    }),
                ])
                .catch((err) => {
                    throw new HttpException({
                        message: err.message,
                        statusCode: HttpStatus.BAD_REQUEST,
                    }, HttpStatus.BAD_REQUEST);
                });
        });
    }
}
