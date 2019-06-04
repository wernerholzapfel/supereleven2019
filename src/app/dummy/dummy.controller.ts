import {Body, Controller, Get, Logger, Post, Req} from '@nestjs/common';
import {DummyService} from './dummy.service';
import {CreateDummyDto} from './create-dummy.dto';
import {Dummy} from './dummy.entity';

@Controller('dummy')
export class DummyController {
    private readonly logger = new Logger('DummyController', true);

    constructor(private readonly service: DummyService) {
    }

    @Get()
    async findAll(): Promise<Dummy[]> {
        return this.service.getAll();
    }

    @Post()
    async create(@Req() req, @Body() createDto: CreateDummyDto) {
        const newObject = Object.assign({}, createDto);
        return await this.service.create(newObject);
    }
}