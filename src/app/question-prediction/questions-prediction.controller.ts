import {Body, Controller, Get, Param, Post, Req} from '@nestjs/common';
import {MatchPredictionService} from '../match-prediction/match-prediction.service';
import {MatchPrediction} from '../match-prediction/match-prediction.entity';
import {CreateMatchPredictionDto} from '../match-prediction/create-match-prediction.dto';
import {QuestionsPredictionService} from './questions-prediction.service';
import {QuestionPrediction} from './question-prediction.entity';
import {CreateQuestionPredictionDto} from './create-question-prediction.dto';
import {ApiImplicitParam, ApiUseTags} from '@nestjs/swagger';

@ApiUseTags('question-prediction')
@Controller('question-prediction')
export class QuestionsPredictionController {

    constructor(private readonly service: QuestionsPredictionService) {
    }

    @ApiImplicitParam({name: 'predictionid'})
    @Get('prediction/:predictionid')
    async findQuestionsByPredictionIdForParticipant(@Param('predictionid') predictionid): Promise<QuestionPrediction[]> {
        return this.service.findQuestionsByPredictionIdForParticipant(predictionid);
    }

    @Post()
    async create(@Req() req, @Body() createQuestionPredictionDto: CreateQuestionPredictionDto[]) {
        return await this.service.createQuestionPrediction(createQuestionPredictionDto, req.user.uid)
    }
}
