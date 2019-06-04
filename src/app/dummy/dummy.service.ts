import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {Dummy} from './dummy.entity';
import {CreateDummyDto} from './create-dummy.dto';

@Injectable()
export class DummyService {
    private readonly logger = new Logger('DummyService', true);

    constructor(private readonly connection: Connection,
                @InjectRepository(Dummy)
                private readonly repository: Repository<Dummy>,) {
    }

    async getAll(): Promise<Dummy[]> {
        return await this.connection
            .getRepository(Dummy)
            .createQueryBuilder('dummy')
            .getMany();
    }

    async create(dummy: CreateDummyDto): Promise<Dummy> {
        return await this.repository.save(dummy)
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }
}
