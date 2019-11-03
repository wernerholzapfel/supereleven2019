import {Injectable} from '@nestjs/common';
import {Connection} from 'typeorm';
import {Participant} from '../participant/participant.entity';
import admin from 'firebase-admin';
import {TeamPredictionService} from '../team-prediction/team-prediction.service';
import {PredictionType} from '../prediction/create-prediction.dto';
import {RankingTeam} from '../ranking-team/rankingTeam.entity';

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

    async getTotalStand(competitionId: string): Promise<any> {
        // const roundId = '3eeec255-87ea-4a5c-b05d-36e6b980b32b';
        const teamPredictionId = 'ca6e325f-f711-4c9d-ad5d-c9ade8cd522f';
        const matchPredictionId = '6e15638c-39ac-44ea-9ec9-d5e49e9ca9b0';
        const rankingPredictionId = '0bbf90f1-eff0-4d14-90ea-d8ed6cbd1c2c';
        const questionsPredictionId = '76626b1e-afeb-4a38-b0df-1f24af5510f9';
        let teamStand = [];
        let questionsStand = [];
        let rankingStand = [];
        let matchStand = [];

        let db = admin.database();
        let team = db.ref(`${competitionId}/${teamPredictionId}/${PredictionType.Team}/totaal`);

        let matches = db.ref(`${competitionId}/${matchPredictionId}/${PredictionType.Matches}/totaal`);
        let ranking = db.ref(`${competitionId}/${rankingPredictionId}/${PredictionType.Ranking}/totaal`);
        let questions = db.ref(`${competitionId}/${questionsPredictionId}/${PredictionType.Questions}/totaal`);

        await matches.once('value', async function (snapshot) {
            snapshot.val().forEach(matches => {
                // @ts-ignore
                matchStand.push({
                    id: matches.id,
                    displayName: matches.displayName,
                    totalPoints: matches.totalPoints
                })
            });
        }, function (errorObject) {
            console.log('The read failed: ' + errorObject.code);
            return errorObject;
        });

        await ranking.once('value', async function (snapshot) {
            snapshot.val().forEach(ranking => {
                // @ts-ignore
                rankingStand.push({
                    id: ranking.id,
                    displayName: ranking.displayName,
                    totalPoints: ranking.totalPoints
                })
            });
        }, function (errorObject) {
            console.log('The read failed: ' + errorObject.code);
            return errorObject;
        });

        await questions.once('value', async function (snapshot) {
            snapshot.val().forEach(question => {
                // @ts-ignore
                questionsStand.push({
                    id: question.id,
                    displayName: question.displayName,
                    totalPoints: question.totalPoints
                })
            });
        }, function (errorObject) {
            console.log('The read failed: ' + errorObject.code);
            return errorObject;
        });


        await team.once('value', async function (snapshot) {
            const getPoints = function (stand: any[], participantId: any) {
                return stand.find(item => {
                    return item.id === participantId
                }) ? stand.find(item => {
                    return item.id === participantId
                }).totalPoints : 0;
            };

            snapshot.val().forEach(childsnapShot => {
                const matchPoints = getPoints(matchStand, childsnapShot.id);
                const questionPoints = getPoints(questionsStand, childsnapShot.id);
                const rankingPoints = getPoints(rankingStand, childsnapShot.id);

                teamStand.push({
                    id: childsnapShot.id,
                    displayName: childsnapShot.displayName,
                    totalTeamPoints: childsnapShot.totaalpunten,
                    totalMatchPoints: matchPoints,
                    totalQuestionsPoints: questionPoints,
                    totalRankingPoints: rankingPoints,
                    totalPoints: childsnapShot.totaalpunten + matchPoints + questionPoints + rankingPoints
                });
            }, function (errorObject) {
                console.log('The read failed: ' + errorObject.code);
                return errorObject;
            });

        });

        return this.getSortedPositionStand(teamStand.sort((a, b) => {
            return b.totalPoints - a.totalPoints
        }));
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

        const stand = participants
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
            });

        return this.getSortedPositionStand(stand);

    }

    async createMatchStand(competitionId: string, predictionId: string): Promise<any[]> {
        const sortedStand = await this.getMatchStand(predictionId);
        let db = admin.database();

        let docRef = db.ref(`${competitionId}/${predictionId}/${PredictionType.Matches}/totaal`);
        docRef.set(sortedStand);
        return sortedStand
    }

    async createRankingStand(competitionId: string, predictionId: string): Promise<any[]> {
        const sortedStand = await this.getRankingStand(predictionId);
        let db = admin.database();

        let docRef = db.ref(`${competitionId}/${predictionId}/${PredictionType.Ranking}/totaal`);
        docRef.set(sortedStand);
        return sortedStand
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
                                        return rr.id === rankingPrediction.team.id
                                    }).position
                                }
                            })
                            .map(rankingPredictionWithResult => {
                                return {
                                    ...rankingPredictionWithResult,
                                    points: this.determineRankingPoints(rankingPredictionWithResult)
                                }
                            })
                }
            })
            .map(participant => {
                return {
                    ...participant,
                    rankingPredictions: participant.rankingPredictions.sort((a, b) => {
                        return a.position - b.position
                    }),
                    totalPoints: participant.rankingPredictions.reduce((a, b) => {
                        return a + b.points
                    }, 0)
                }
            })
            .sort((a, b) => {
                return b.totalPoints - a.totalPoints
            });

        const standWithPosition = this.getSortedPositionStand(stand);
        return standWithPosition;
    }

    async createQuestionStand(competitionId: string, predictionId: string): Promise<any[]> {
        const sortedStand = await this.getQuestionStand(predictionId);
        let db = admin.database();

        let docRef = db.ref(`${competitionId}/${predictionId}/${PredictionType.Questions}/totaal`);
        docRef.set(sortedStand);
        return sortedStand
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
                        return a + b.punten
                    }, 0)
                }
            })
            .sort((a, b) => {
                return b.totalPoints - a.totalPoints
            });

        return this.getSortedPositionStand(stand);
    }

    determineRankingPoints(rankingPrediction: any) {
        if (!rankingPrediction.positionresult) {
            return null;
        }
        if (rankingPrediction.position === 1 && rankingPrediction.position === rankingPrediction.positionresult) {
            return 15
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
