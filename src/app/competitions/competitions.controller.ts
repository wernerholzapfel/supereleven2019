import {Body, Controller, Get, Logger, Param, Post, Req} from '@nestjs/common';
import {CompetitionService} from './competition.service';
import {Competition} from './competition.entity';
import {CreateCompetitionDto} from './create-competition.dto';

@Controller('competition')
export class CompetitionsController {
    private readonly logger = new Logger('CompetitionsController', true);

    constructor(private readonly competitionService: CompetitionService) {
    }

    @Get()
    async findAll(): Promise<Competition[]> {
        return this.competitionService.getAll();
    }

    @Post()
    async create(@Req() req, @Body() createCompetitionDto: CreateCompetitionDto) {
        this.logger.log('post competition');
        const newObject = Object.assign({}, createCompetitionDto);
        return await this.competitionService.create(newObject);
    }
}