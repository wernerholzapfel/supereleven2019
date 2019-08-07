import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Teamplayerscores} from './teamplayerscores.entity';
import {CreateTeamPredictionDto} from '../team-prediction/create-team-prediction.dto';

@Injectable()
export class TeamPlayerScoresService {

    constructor(private readonly connection: Connection,
                @InjectRepository(Teamplayerscores)
                private readonly repository: Repository<Teamplayerscores>,) {
    }

    async create(scores: CreateTeamPredictionDto): Promise<Teamplayerscores> {
        return await this.repository.save(scores)
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }
}
