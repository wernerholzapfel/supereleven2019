import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Connection, getManager, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Teamprediction} from './team-prediction.entity';
import {CreateTeamPredictionDto} from './create-team-prediction.dto';
import {Participant} from '../participant/participant.entity';
import {RoundService} from '../round/round.service';
import {Observable} from 'rxjs';
import {Position} from '../team-player/teamplayer.entity';
import {Round} from '../round/round.entity';

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
            .leftJoinAndSelect('teamPlayer.player', 'player')
            .leftJoinAndSelect('teamPlayer.team', 'team')
            .where('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .andWhere('teamPredictions.isActive')
            .getOne();


        return participant ? participant.teamPredictions : [];
    }

    async getRoundStand(predictionId: string, roundId: string) {
        const participants: any[] = await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.teamPredictions', 'teamPredictions', 'teamPredictions.prediction.id = :predictionId and teamPredictions.round.id = :roundId', {
                predictionId,
                roundId
            })
            .leftJoinAndSelect('teamPredictions.teamPlayer', 'teamPlayer')
            .leftJoinAndSelect('teamPredictions.round', 'prediction_round')
            .leftJoinAndSelect('teamPredictions.tillRound', 'tillRound')
            .leftJoinAndSelect('teamPredictions.captainTillRound', 'captainTillRound')
            .leftJoinAndSelect('teamPlayer.player', 'player')
            .leftJoinAndSelect('teamPlayer.teamplayerscores', 'teamplayerscores')
            .leftJoinAndSelect('teamplayerscores.round', 'score_round')
            .leftJoinAndSelect('teamPlayer.team', 'team')
            .orderBy('teamPredictions.isActive', 'DESC')
            .getMany();

        return this.calculateStand(participants);

    }

    async getStand(predictionId: string): Promise<any[]> {
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
            .orderBy('teamPredictions.isActive', 'DESC')
            .getMany();

        return this.calculateStand(participants);

    }

    isCaptain(prediction, round: Round): boolean {
        if (prediction.captain) {
            this.logger.log(round);
            this.logger.log(prediction);
            if (prediction.captainTillRound) {
                this.logger.log(prediction.captainTillRound.startDate);
            }
            this.logger.log((prediction.captain && !!prediction.captainTillRound) || (prediction.captainTillRound && prediction.captainTillRound.startDate > round.startDate));
        }
        return (prediction.captain && !prediction.captainTillRound) || (prediction.captainTillRound && prediction.captainTillRound.startDate > round.startDate)
    }

    public calculateStand(participants: any[]) {
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
                                teamplayertotaalpunten: this.calculateTeamplayerTotaalPunten(prediction.teamPlayer.teamplayerpunten),
                            }
                        }
                    }).sort((a, b) => {
                        const x = this.setSortValuePosition(a.teamPlayer.position);
                        const y = this.setSortValuePosition(b.teamPlayer.position);
                        return x < y ? -1 : x > y ? 1 : 0
                    })
                }
            })
            .map(participant => {
                return {
                    ...participant,
                    totaalpunten: participant.teamPredictions.reduce((totalPoints, player) => {
                        return totalPoints + player.teamPlayer.teamplayertotaalpunten.totaal;
                    }, 0)
                }
            })
            .sort((a, b) => {
                return a.totaalpunten > b.totaalpunten ? -1 : a.totaalpunten < b.totaalpunten ? 1 : 0;
            });

        return stand.map((participant, index) => {
            if (index > 0 && participant.totaalpunten === stand[index - 1].totaalpunten) {
                return {
                    ...participant,
                    position: previousPosition
                }
            } else {
                previousPosition = index + 1;
                return {
                    ...participant,
                    position: index + 1
                }
            }
        });
    }

    calculateTeamplayerTotaalPunten(teamplayerpunten) {
        return {
            'played': this.addReduceFunction(teamplayerpunten, 'played'),
            'win': this.addReduceFunction(teamplayerpunten, 'win'),
            'draw': this.addReduceFunction(teamplayerpunten, 'draw'),
            'cleansheet': this.addReduceFunction(teamplayerpunten, 'cleansheet'),
            'yellow': this.addReduceFunction(teamplayerpunten, 'yellow'),
            'secondyellow': this.addReduceFunction(teamplayerpunten, 'secondyellow'),
            'red': this.addReduceFunction(teamplayerpunten, 'red'),
            'goals': this.addReduceFunction(teamplayerpunten, 'goals'),
            'assists': this.addReduceFunction(teamplayerpunten, 'assists'),
            'penaltymissed': this.addReduceFunction(teamplayerpunten, 'penaltymissed'),
            'penaltystopped': this.addReduceFunction(teamplayerpunten, 'penaltystopped'),
            'owngoal': this.addReduceFunction(teamplayerpunten, 'owngoal'),
            'totaal': this.addReduceFunction(teamplayerpunten, 'totaal'),
        }
    }

    addReduceFunction(array: any[], property: string) {
        return array.reduce((totalPoints, item) => {
            return item[property] ? totalPoints + item[property] : totalPoints;
        }, 0)
    };

    private setSortValuePosition(position: string) {
        switch (position) {
            case Position.Keeper: {
                return 0
            }
            case Position.Defender: {
                return 1
            }
            case Position.Midfielder: {
                return 2
            }
            case Position.Forward: {
                return 3
            }

        }
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

    async create(newTeam: CreateTeamPredictionDto[], firebaseIdentifier: string): Promise<Teamprediction[] | Observable<void>> {

        const participant = await this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .where('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .getOne();

        const nextRound = await this.roundService.getNextRound();

        const currentTeam = await this.connection
            .getRepository(Teamprediction)
            .createQueryBuilder('teamPredictions')
            .leftJoin('teamPredictions.participant', 'participant')
            .leftJoin('teamPredictions.prediction', 'prediction')
            .leftJoinAndSelect('teamPredictions.teamPlayer', 'teamPlayer')
            .leftJoinAndSelect('teamPlayer.player', 'player')
            .leftJoinAndSelect('teamPlayer.team', 'team')
            .leftJoinAndSelect('teamPredictions.round', 'round')
            .where('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .andWhere('prediction.id = :predictionId', {predictionId: newTeam[0].prediction.id})
            .getMany();

        // .getRepository(Participant)
        // .createQueryBuilder('participant')
        // .leftJoinAndSelect('participant.teamPredictions', 'teamPredictions', 'teamPredictions.prediction.id = :predictionId', {predictionId: teamPredictions[0].prediction.id})
        // .leftJoinAndSelect('teamPredictions.teamPlayer', 'teamPlayer')
        // .leftJoinAndSelect('teamPlayer.player', 'player')
        // .leftJoinAndSelect('teamPlayer.team', 'team')
        // .leftJoinAndSelect('teamPredictions.round', 'round')
        // .where('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
        // .getOne();


        const previousActivePlayers = currentTeam
            .filter(currentpl => currentpl.isActive)
            .map(ap => {
                if (!newTeam.find(tp => tp.teamPlayer.id === ap.teamPlayer.id && ap.isActive)) {
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


        const currentCaptain = currentTeam.find(player => player.captain);
        const newCaptain = newTeam.find(player => player.captain);

        // filter form with previousactiveplayers so only new players are left over.
        let newPlayers = newTeam.reduce((unique, item) => {
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

        if (newPlayers.length + currentTeam.length > 17) {
            throw new HttpException({
                message: `Je mag nog ${17 - currentTeam.length} transfers doorvoeren`,
                statusCode: HttpStatus.FORBIDDEN,
            }, HttpStatus.FORBIDDEN);
        }

        // todo logica netter uitschrijven met name wisselen van captain

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
            if (!currentCaptain && newCaptain || newCaptain && currentCaptain.teamPlayer.id !== newCaptain.teamPlayer.id) {
                //add new captain if he is not in the newplayers? dont understand this
                newPlayers = newPlayers.find(np => newCaptain && np.teamPlayer.id === newCaptain.teamPlayer.id)
                    ? [...newPlayers]
                    : [...newPlayers, newCaptain];
                // new captain moet toegevoegd worden, maar oude speler niet meer actief
                await transactionalEntityManager.getRepository(Teamprediction)
                    .createQueryBuilder('teamPrediction')
                    .update(Teamprediction)
                    .set({isActive: false})
                    .where('"teamPlayerId" = :newCaptainId', {newCaptainId: newCaptain.teamPlayer.id})
                    .andWhere('"participantId" = :participantId', {participantId: participant.id})
                    .execute();

                if (currentCaptain) {
                    // current captain wordt captain af
                    await transactionalEntityManager.getRepository(Teamprediction)
                        .createQueryBuilder('teamPrediction')
                        .leftJoin('teamPrediction.participant', 'participant')
                        .leftJoin('teamPrediction.teamPlayer', 'teamPlayer')
                        .update(Teamprediction)
                        .set({captain: false, captainTillRound: nextRound})
                        .where('"teamPlayerId" = :newCaptainId', {newCaptainId: newCaptain.teamPlayer.id})
                        .andWhere('"participantId" = :participantId', {participantId: participant.id})
                        .execute();
                }
            }
            return await transactionalEntityManager.getRepository(Teamprediction)
                .save([
                    ...newPlayers.map(p => {
                        return {
                            ...p,
                            round: {id: nextRound.id},
                            participant
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
