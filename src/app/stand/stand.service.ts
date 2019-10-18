import {Injectable} from '@nestjs/common';
import {Connection} from 'typeorm';
import {Participant} from '../participant/participant.entity';
import admin from 'firebase-admin';
import {TeamPredictionService} from '../team-prediction/team-prediction.service';
import {PredictionType} from '../prediction/create-prediction.dto';

@Injectable()
export class StandService {

    constructor(private readonly connection: Connection, private teamPredictionService: TeamPredictionService) {
    }
    private getSortedPositionStand(sortedStand) {
        let previousPosition = 1;

        return sortedStand.map((participant, index) => {
            if (index > 0 && participant.totalPoints === sortedStand[index - 1].totalPoints) {
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

    async createTotalStand(competitionId: string): Promise<any[]> {
        const sortedPositionStand = await this.getTotalStand(competitionId);
        let db = admin.database();

        let docRef = db.ref(`${competitionId}/totaalstand/totaal`);
        docRef.set(sortedPositionStand);

        let lastUpdatedref = db.ref(`${competitionId}/lastUpdated`);
        lastUpdatedref.set({lastUpdated: Date.now()});

        return sortedPositionStand;
    }

    async getTotalStand(competitionId: string): Promise<any[]> {
        const participants: any[] = await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.teamPredictions', 'teamPredictions', 'teamPredictions.competition.id = :competitionId', {competitionId})
            .leftJoinAndSelect('teamPredictions.teamPlayer', 'teamPlayer')
            .leftJoinAndSelect('teamPredictions.round', 'prediction_round')
            .leftJoinAndSelect('teamPredictions.tillRound', 'tillRound')
            .leftJoinAndSelect('teamPredictions.captainTillRound', 'captainTillRound')
            .leftJoinAndSelect('teamPlayer.player', 'player')
            .leftJoinAndSelect('teamPlayer.teamplayerscores', 'teamplayerscores')
            .leftJoinAndSelect('teamplayerscores.round', 'score_round')
            .leftJoinAndSelect('teamPlayer.team', 'team')
            .leftJoinAndSelect('participant.matchPredictions', 'matchPredictions')
            .leftJoin('matchPredictions.competition', 'competition')
            .leftJoinAndSelect('matchPredictions.match', 'match')
            .where('competition.id = :competitionId', {competitionId})
            .orderBy('teamPredictions.isActive', 'DESC')
            .getMany();

        const teamStand = this.teamPredictionService.calculateStand(participants);
        let totalstand = teamStand.map(participant => {
            return {
                ...participant,
                totalTeamPoints: participant.totaalpunten,
                totalMatchPoints: participant.matchPredictions.reduce((a, b) => {
                    return a + b.punten
                }, 0),
            }
        });

        const sortedStand = totalstand.map(participant => {
            return {
                id: participant.id,
                displayName: participant.displayName,
                teamName: participant.teamName,
                totalMatchPoints: participant.totalMatchPoints,
                totalTeamPoints: participant.totalTeamPoints,
                totalPoints: participant.totalMatchPoints + participant.totaalpunten
            }
        }).sort((a, b) => {
            return b.totalPoints - a.totalPoints
        });

        return this.getSortedPositionStand(sortedStand)
    }

    async getMatchStand(predictionId: string): Promise<any[]> {
        const participants: any = await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.matchPredictions', 'matchPredictions')
            .leftJoin('matchPredictions.prediction', 'prediction')
            .leftJoinAndSelect('matchPredictions.match', 'match')
            .where('prediction.id = :predictionId', {predictionId})
            .orderBy('match.date')
            .getMany();

        return participants
            .map(participant => {
                return {
                    ...participant,
                    totalPoints: participant.matchPredictions.reduce((a, b) => {
                        return a + b.punten
                    }, 0)
                }
            })
            .sort((a, b) => {
                return b.totalPoints - a.totalPoints
            })
    }

    async createMatchStand(competitionId: string, predictionId: string): Promise<any[]> {
       const sortedStand = await this.getMatchStand(predictionId);
        let db = admin.database();

        let docRef = db.ref(`${competitionId}/${predictionId}/${PredictionType.Matches}/totaal`);
        docRef.set(sortedStand);
        return this.getSortedPositionStand(sortedStand);
    }
}
