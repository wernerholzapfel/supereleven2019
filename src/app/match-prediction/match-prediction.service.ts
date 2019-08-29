import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {MatchPrediction} from './match-prediction.entity';
import {CreateMatchPredictionDto} from './create-match-prediction.dto';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Participant} from '../participant/participant.entity';

@Injectable()
export class MatchPredictionService {

    constructor(private connection: Connection,
                @InjectRepository(MatchPrediction)
                private readonly matchPrediction: Repository<MatchPrediction>) {

    }

    async findMatchesByPredictionIdForParticipant(predictionid: string, firebaseIdentifier: string): Promise<MatchPrediction[]> {
        return await this.connection.getRepository(MatchPrediction)
            .createQueryBuilder('matchprediction')
            .leftJoin('matchprediction.prediction', 'prediction')
            .leftJoin('matchprediction.participant', 'participant')
            .leftJoinAndSelect('matchprediction.match', 'match')
            .where('prediction.id = :id', {id: predictionid})
            .andWhere('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .orderBy('match.date')
            .getMany();

    }

    async createMatchPrediction(items: CreateMatchPredictionDto[], firebaseIdentifier): Promise<MatchPrediction[]> {

        const participant = await this.connection.getRepository(Participant)
            .createQueryBuilder('participant')
            .where('participant.firebaseIdentifier = :firebaseIdentifier', {firebaseIdentifier})
            .getOne();

        return await this.matchPrediction.save(items.map(p => {
            return {
                ...p,
                participant
            }
        }))
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }

}
