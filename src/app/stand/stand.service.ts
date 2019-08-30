import {Injectable} from '@nestjs/common';
import {Connection} from 'typeorm';
import {Participant} from '../participant/participant.entity';

@Injectable()
export class StandService {

    constructor(private readonly connection: Connection) {
    }

    async getMatchStand(predictionId: string): Promise<any[]> {
        let previousPosition = 1;

        const participants: any = await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.matchPredictions', 'matchPredictions')
            .leftJoin('matchPredictions.prediction', 'prediction')
            .leftJoinAndSelect('matchPredictions.match', 'match')
            .where('prediction.id = :predictionId', {predictionId})
            .orderBy('match.date')
            .getMany();


        return participants.map(participant => {
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
            .map((participant, index) => {
                if (index > 0 && participant.totalPoints === participants[index - 1].totalPoints) {
                    return {
                        ...participant,
                        position: previousPosition
                    }
                } else {
                    return {
                        ...participant,
                        position: index + 1
                    }
                }
            });
    }
}
