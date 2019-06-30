import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {MatchPrediction} from './match-prediction.entity';
import {CreateMatchPredictionDto} from './create-match-prediction.dto';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class MatchPredictionService {

    constructor(private connection: Connection,
                @InjectRepository(MatchPrediction)
                private readonly matchPrediction: Repository<MatchPrediction>) {

    }

    async findMatchesByPredictionIdForParticipant(predictionid: string): Promise<MatchPrediction[]> {
        return await this.connection.getRepository(MatchPrediction)
            .createQueryBuilder('matchprediction')
            .leftJoin('matchprediction.prediction', 'prediction')
            .leftJoinAndSelect('matchprediction.match', 'match')
            .where('prediction.id = :id', {id: predictionid})
            .getMany();

    }

    async createMatchPrediction(items: CreateMatchPredictionDto[], firebaseIdentifier): Promise<MatchPrediction[]> {
        return await this.matchPrediction.save(items.map(p => {
            return {
                ...p,
                participant: {firebaseIdentifier}
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
