import {Injectable, Logger} from '@nestjs/common';
import {Connection} from 'typeorm';
import {Participant} from '../participant/participant.entity';
import admin from 'firebase-admin';
import {TeamPredictionService} from '../team-prediction/team-prediction.service';
import {PredictionType} from '../prediction/create-prediction.dto';
import {RankingTeam} from '../ranking-team/rankingTeam.entity';

@Injectable()
export class StandService {
    private readonly logger = new Logger('StandService', true);

    constructor(private readonly connection: Connection, private teamPredictionService: TeamPredictionService) {
    }

    private getSortedPositionStand(sortedStand) {
        this.logger.log('getSortedPositionStand');
        let previousPosition = 1;

        return sortedStand.map((participant, index) => {
            if (index > 0 && participant && participant.totalPoints === sortedStand[index - 1].totalPoints) {
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

    async createTotalStand(competitionId: string): Promise<any[]> {
        const sortedPositionStand = await this.getTotalStand(competitionId);
        const db = admin.database();

        const docRef = db.ref(`${competitionId}/totaalstand/totaal`);
        docRef.set(sortedPositionStand);

        const lastUpdatedref = db.ref(`${competitionId}/lastUpdated`);
        lastUpdatedref.set({lastUpdated: Date.now()});

        return sortedPositionStand;
    }

    async getTotalStandFB(competitionId: string): Promise<any> {
        this.logger.log('getTotalStandFB start');
        let totalstand = [];
        let questionStand = [];
        let matchesStand = [];
        let teamStand = [];

        const rankingStandMeenemen = false;
        const db = admin.database();

        const teamRef = db.ref('dd0c5fa2-9202-40e9-9505-ff8a3dbb6429/a855cf19-195f-484e-88cc-c9dbc744ae98/Team/totaal'); // todo
        await teamRef.once('value', async teamTotaal => {
            this.logger.log('teamTotaal: ' + teamTotaal.val().length);
            this.logger.log('fb console');
            teamStand = teamTotaal.val();
        });
        const matchesRef = db.ref('dd0c5fa2-9202-40e9-9505-ff8a3dbb6429/7903e5e5-151b-4508-ac3b-df61f69fc616/Matches/totaal'); // todo
        await matchesRef.once('value', async (matches) => {
            this.logger.log('matches: ' + matches.val().length);
            matchesStand = matches.val();
        });

        const questionRef = db.ref('dd0c5fa2-9202-40e9-9505-ff8a3dbb6429/2d6b5514-5375-4800-ae87-9072d1644dfa/Questions/totaal'); // todo
        await questionRef.once('value', async question => {
            this.logger.log('question: ' + question.val().length);

            questionStand = question.val();
        });

        totalstand = teamStand.map(participant => {
            return {
                displayName: participant.displayName,
                id: participant.id,
                teamName: participant.teamName,
                totalTeamPoints: participant.totaalpunten,
                totalRankingPoints: 0,
                totalMatchPoints: matchesStand.length > 0 ? matchesStand.find(m => m.id === participant.id).totalPoints : 0,
                totalQuestionPoints: questionStand.length > 0 ? questionStand.find(q => q.id === participant.id).totalPoints : 0,
            };
        })
            .map(participant => {
                return {
                    ...participant,
                    totalPoints: participant.totalMatchPoints
                        + participant.totalTeamPoints
                        + participant.totalRankingPoints
                        + participant.totalQuestionPoints,
                };
            })
            .sort((a, b) => {
                return b.totalPoints - a.totalPoints;
            });
        return totalstand;
    }


    async getTotalStand(competitionId: string): Promise<any[]> {
        this.logger.log('getTotalStand start');
        const rankingStandMeenemen = false;
        let rankingStand = [];
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

        this.logger.log('aantal participants: ' + participants.length);

        this.logger.log('calculatesTand');
        const teamStand = await this.teamPredictionService.calculateStand(participants);
        this.logger.log('calculatesTand done');

        const totalstand = teamStand.map(participant => {
            return {
                ...participant,
                totalTeamPoints: participant.totaalpunten,
                totalMatchPoints: participant.matchPredictions.reduce((a, b) => {
                    return a + b.punten;
                }, 0),
            };
        });
        this.logger.log('totalstand done');

        if (rankingStandMeenemen) {
            rankingStand = await this.getRankingStand('ca10d47a-b7a3-4266-b5dc-a1e42d7e3403'); // todo
            this.logger.log('rankingStand done');

        }

        const questionstand = await this.getQuestionStand('2d6b5514-5375-4800-ae87-9072d1644dfa');
        this.logger.log('getQuestionStand done');

        const stand: any[] = totalstand.map(participant => {
            return {
                id: participant.id,
                displayName: participant.displayName,
                teamName: participant.teamName,
                totalMatchPoints: participant.totalMatchPoints,
                totalTeamPoints: participant.totalTeamPoints,
                totalRankingPoints: rankingStandMeenemen && rankingStand.find(participantR => {
                    return participantR.id === participant.id;
                }) ? rankingStand.find(participantR => {
                    return participantR.id === participant.id;
                }).totalPoints : null,
                totalQuestionPoints: questionstand.find(participantR => {
                    return participantR.id === participant.id;
                }) ? questionstand.find(participantR => {
                    return participantR.id === participant.id;
                }).totalPoints : null,
            };
        }).map(participant => {
            return {
                ...participant,
                totalPoints: participant.totalMatchPoints
                    + participant.totalTeamPoints
                    + participant.totalRankingPoints
                    + participant.totalQuestionPoints,
            };
        })
            .sort((a, b) => {
                return b.totalPoints - a.totalPoints;
            });

        this.logger.log('start getSortedPositionStand');
        return this.getSortedPositionStand(stand);
    }

    async getMatchStand(predictionId: string): Promise<any[]> {
        this.logger.log('getMatchStand');

        const participants: any = await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.matchPredictions', 'matchPredictions')
            .leftJoin('matchPredictions.prediction', 'prediction')
            .leftJoinAndSelect('matchPredictions.match', 'match')
            .where('prediction.id = :predictionId', {predictionId})
            .orderBy('match.date')
            .getMany();

        this.logger.log('aantal participants: ' + participants.length);
        const stand = participants
            .map(participant => {
                return {
                    ...participant,
                    totalPoints: participant.matchPredictions.reduce((a, b) => {
                        return a + b.punten;
                    }, 0),
                };
            })
            .sort((a, b) => {
                return b.totalPoints - a.totalPoints;
            });

        return this.getSortedPositionStand(stand);

    }

    async createMatchStand(competitionId: string, predictionId: string): Promise<any[]> {
        this.logger.log('createMatchStand');
        const sortedStand = await this.getMatchStand(predictionId);
        const db = admin.database();

        const docRef = db.ref(`${competitionId}/${predictionId}/${PredictionType.Matches}/totaal`);
        docRef.set(sortedStand);
        return sortedStand;
    }

    async createRankingStand(competitionId: string, predictionId: string): Promise<any[]> {
        const sortedStand = await this.getRankingStand(predictionId);
        const db = admin.database();

        const docRef = db.ref(`${competitionId}/${predictionId}/${PredictionType.Ranking}/totaal`);
        docRef.set(sortedStand);
        return sortedStand;
    }

    async getRankingStand(predictionId: string): Promise<any[]> {
        const participants: any = await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.rankingPredictions', 'rankingPredictions')
            .leftJoinAndSelect('rankingPredictions.team', 'rankingteam')
            .leftJoinAndSelect('rankingteam.team', 'team')
            .leftJoin('rankingPredictions.prediction', 'prediction')
            .where('prediction.id = :predictionId', {predictionId})
            .getMany();

        const rankingResults = await this.connection
            .getRepository(RankingTeam)
            .createQueryBuilder('rankingTeam')
            .leftJoin('rankingTeam.prediction', 'prediction')
            .leftJoinAndSelect('rankingTeam.team', 'team')
            .where('prediction.id = :predictionId', {predictionId})
            .getMany();

        const stand = participants
            .map(participant => {
                return {
                    ...participant,
                    rankingPredictions:
                        participant.rankingPredictions
                            .map(rankingPrediction => {
                                return {
                                    ...rankingPrediction,
                                    positionresult: rankingResults.find(rr => {
                                        return rr.id === rankingPrediction.team.id;
                                    }).position,
                                };
                            })
                            .map(rankingPredictionWithResult => {
                                return {
                                    ...rankingPredictionWithResult,
                                    points: this.determineRankingPoints(rankingPredictionWithResult),
                                };
                            }),
                };
            })
            .map(participant => {
                return {
                    ...participant,
                    rankingPredictions: participant.rankingPredictions.sort((a, b) => {
                        return a.position - b.position;
                    }),
                    totalPoints: participant.rankingPredictions.reduce((a, b) => {
                        return a + b.points;
                    }, 0),
                };
            })
            .sort((a, b) => {
                return b.totalPoints - a.totalPoints;
            });

        const standWithPosition = this.getSortedPositionStand(stand);
        return standWithPosition;
    }

    async createQuestionStand(competitionId: string, predictionId: string): Promise<any[]> {
        const sortedStand = await this.getQuestionStand(predictionId);
        const db = admin.database();

        const docRef = db.ref(`${competitionId}/${predictionId}/${PredictionType.Questions}/totaal`);
        docRef.set(sortedStand);
        return sortedStand;
    }

    async getQuestionStand(predictionId: string): Promise<any[]> {
        const participants: any = await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.questionPredictions', 'questionPredictions')
            .leftJoin('questionPredictions.prediction', 'prediction')
            .leftJoinAndSelect('questionPredictions.question', 'question')
            .where('prediction.id = :predictionId', {predictionId})
            .orderBy('question.sortId')
            .getMany();

        const stand = participants
            .map(participant => {
                return {
                    ...participant,
                    totalPoints: participant.questionPredictions.reduce((a, b) => {
                        return a + b.punten;
                    }, 0),
                };
            })
            .sort((a, b) => {
                return b.totalPoints - a.totalPoints;
            });

        return this.getSortedPositionStand(stand);
    }

    determineRankingPoints(rankingPrediction: any) {
        if (!rankingPrediction.positionresult) {
            return null;
        }
        if (rankingPrediction.position === 1 && rankingPrediction.position === rankingPrediction.positionresult) {
            return 15;
        } else {
            const positionDifference = (rankingPrediction.position - rankingPrediction.positionresult);

            switch (positionDifference) {
                case 2 || -2:
                    return 3;
                case 1 || -1:
                    return 5;
                case 0:
                    return 10;
                default:
                    return 0;
            }
        }
    }
}
