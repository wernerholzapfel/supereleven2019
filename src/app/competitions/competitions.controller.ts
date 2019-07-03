import {Body, Controller, Get, Logger, Param, Post, Req} from '@nestjs/common';
import {CompetitionService} from './competition.service';
import {Competition} from './competition.entity';
import {CreateCompetitionDto} from './create-competition.dto';
import {ApiUseTags} from '@nestjs/swagger';

@ApiUseTags('competition')
@Controller('competition')
export class CompetitionsController {
    private readonly logger = new Logger('CompetitionsController', true);

    constructor(private readonly service: CompetitionService) {
    }

    @Get()
    async findAll(): Promise<Competition[]> {
        return this.service.getAll();
    }

    @Post()
    async create(@Req() req, @Body() createCompetitionDto: CreateCompetitionDto) {
        this.logger.log('post competition');
        const newObject = Object.assign({}, createCompetitionDto);
        return await this.service.create(newObject);
    }
}