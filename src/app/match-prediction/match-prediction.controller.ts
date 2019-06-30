import {Body, Controller, Get, Param, Post, Req} from '@nestjs/common';
import {CreateMatchPredictionDto} from './create-match-prediction.dto';
import {MatchPrediction} from './match-prediction.entity';
import {MatchPredictionService} from './match-prediction.service';

@Controller('match-prediction')
export class MatchPredictionController {

    constructor(private readonly service: MatchPredictionService) {
    }

    @Get('prediction/:predictionid')
    async findMatchesByPredictionIdForParticipant(@Param('predictionid') predictionid): Promise<MatchPrediction[]> {
        return this.service.findMatchesByPredictionIdForParticipant(predictionid);
    }

    @Post()
    async create(@Req() req, @Body() createMatchPredictionDto: CreateMatchPredictionDto[]) {
        return await this.service.createMatchPrediction(createMatchPredictionDto, req.user.uid)
    }
}