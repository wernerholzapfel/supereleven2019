import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Teamprediction} from './team-prediction.entity';
import {CreateTeamPredictionDto} from './create-team-prediction.dto';
import {Participant} from '../participant/participant.entity';

@Injectable()
export class TeamPredictionService {
    constructor(private readonly connection: Connection,
                @InjectRepository(Teamprediction)
                private readonly repository: Repository<Teamprediction>,) {
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


    async create(teamPredictions: CreateTeamPredictionDto[], firebaseIdentifier: string): Promise<Teamprediction[]> {
        return await this.repository.save(teamPredictions.map(p => {
            return {
                ...p,
                participant: {firebaseIdentifier: firebaseIdentifier}
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
