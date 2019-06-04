import {Body, Controller, Get, Logger, Post, Req} from '@nestjs/common';
import {RankingTeamService} from './rankingTeam.service';
import {RankingTeam} from './rankingTeam.entity';
import {CreateRankingTeamDto} from './create-rankingTeam.dto';

@Controller('rankingteam')
export class RankingTeamController {
    private readonly logger = new Logger('RankingTeamController', true);

    constructor(private readonly service: RankingTeamService) {
    }

    @Get()
    async findAll(): Promise<RankingTeam[]> {
        return this.service.getAll();
    }

    @Post()
    async create(@Req() req, @Body() createDto: CreateRankingTeamDto) {
        const newObject = Object.assign({}, createDto);
        return await this.service.create(newObject);
    }
}