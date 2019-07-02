import {Body, Controller, Get, Logger, Param, Post, Req} from '@nestjs/common';
import {CreateRankingPredictionsDto} from './create-rankingPredictions.dto';
import {RankingPredictionsService} from './rankingPredictions.service';
import {RankingPrediction} from './rankingPredictions.entity';

@Controller('rankingprediction')
export class RankingPredictionsController {
    private readonly logger = new Logger('RankingpredictionsController', true);

    constructor(private readonly rankingpredictionsService: RankingPredictionsService) {
    }

    @Get()
    async get(): Promise<RankingPrediction[]> {
        return this.rankingpredictionsService.getAll();
    }

    @Get('competitionid/:competitionid')
    async findAll(@Param('competitionid') competitionid, @Req() req): Promise<RankingPrediction[]> {
        return this.rankingpredictionsService.findAllByCompetitionId(competitionid, req.user.email);
    }

    @Post()
    async create(@Req() req, @Body() createRankingpredictionsDto: CreateRankingPredictionsDto[]) {
        this.logger.log('post headline');
        console.log(req.user);
        return await this.rankingpredictionsService.create(createRankingpredictionsDto, req.user.uid);
    }
}