import {Body, Controller, Get, Logger, Param, Post, Req} from '@nestjs/common';
import {RankingTeamService} from './rankingTeam.service';
import {RankingTeam} from './rankingTeam.entity';
import {CreateRankingTeamDto} from './create-rankingTeam.dto';
import {RankingPrediction} from '../ranking-prediction/rankingPredictions.entity';
import {ApiImplicitParam, ApiUseTags} from '@nestjs/swagger';

@ApiUseTags('rankingteam')
@Controller('rankingteam')
export class RankingTeamController {
    private readonly logger = new Logger('RankingTeamController', true);

    constructor(private readonly service: RankingTeamService) {
    }

    @ApiImplicitParam({name: 'competitionid'})
    @Get('competitionid/:competitionid')
    async findAll(@Param('competitionid') competitionid): Promise<RankingTeam[]> {
        return this.service.getAllByCompetitionId(competitionid);
    }

    @Post()
    async create(@Req() req, @Body() createDto: CreateRankingTeamDto) {
        const newObject = Object.assign({}, createDto);
        return await this.service.create(newObject);
    }
}