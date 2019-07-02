import { Injectable } from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Player} from '../player/player.entity';
import {Teamplayer} from './teamplayer.entity';

@Injectable()
export class TeamPlayerService {
    constructor(private readonly connection: Connection,
                @InjectRepository(Teamplayer)
                private readonly repository: Repository<Teamplayer>,) {
    }

    async getAllByPredictionId(predictionId: string): Promise<Teamplayer[]> {
        return await this.connection
            .getRepository(Teamplayer)
            .createQueryBuilder('teamplayers')
            .leftJoinAndSelect('teamplayers.player', 'player')
            .leftJoinAndSelect('teamplayers.team', 'team')
            .leftJoin('teamplayers.prediction', 'prediction')
            .where('prediction.id = :id', {id: predictionId})
            .getMany();
    }
}
