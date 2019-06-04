import {Body, Controller, Get, Logger, Param, Post, Req} from '@nestjs/common';
import {CreateRankingPredictionsDto} from './create-rankingPredictions.dto';
import {RankingPredictionsService} from './rankingPredictions.service';
import {RankingPrediction} from './rankingPredictions.entity';

@Controller('rankingprediction')
export class RankingPredictionsController {
    private readonly logger = new Logger('RankingpredictionsController', true);

    constructor(private readonly rankinkpredictionsService: RankingPredictionsService) {
    }

    @Get()
    async get(): Promise<RankingPrediction[]> {
        return this.rankinkpredictionsService.getAll();
    }

    @Get('competition/:competitionId')
    async findAll(@Param('competitionId') competitionId): Promise<RankingPrediction[]> {
        return this.rankinkpredictionsService.findAllById(competitionId);
    }

    @Post()
    async create(@Req() req, @Body() createRankingpredictionsDto: CreateRankingPredictionsDto[]) {
        this.logger.log('post headline');
        const newObject = Object.assign({}, createRankingpredictionsDto);
        return await this.rankinkpredictionsService.create(newObject);
    }
}