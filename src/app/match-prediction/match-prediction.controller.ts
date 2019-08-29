import {Body, Controller, Get, Param, Post, Req} from '@nestjs/common';
import {CreateMatchPredictionDto} from './create-match-prediction.dto';
import {MatchPrediction} from './match-prediction.entity';
import {MatchPredictionService} from './match-prediction.service';
import {ApiImplicitParam, ApiUseTags} from '@nestjs/swagger';

@ApiUseTags('match-prediction')
@Controller('match-prediction')
export class MatchPredictionController {

    constructor(private readonly service: MatchPredictionService) {
    }

    @ApiImplicitParam({name: 'predictionid'})
    @Get('prediction/:predictionid')
    async findMatchesByPredictionIdForParticipant(@Req() req, @Param('predictionid') predictionid): Promise<MatchPrediction[]> {
        return this.service.findMatchesByPredictionIdForParticipant(predictionid, req.user.uid);
    }

    @Post()
    async create(@Req() req, @Body() createMatchPredictionDto: CreateMatchPredictionDto[]) {
        return await this.service.createMatchPrediction(createMatchPredictionDto, req.user.uid)
    }
}
