import {Injectable} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Player} from './player.entity';

@Injectable()
export class PlayerService {

    constructor(private readonly connection: Connection,
                @InjectRepository(Player)
                private readonly repository: Repository<Player>,) {
    }

    async getAll(): Promise<Player[]> {
        return await this.connection
            .getRepository(Player)
            .createQueryBuilder('players')
            .getMany();
    }
}
