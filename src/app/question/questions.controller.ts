import {Body, Controller, Get, Param, Post, Req} from '@nestjs/common';
import {QuestionsService} from './questions.service';
import {Question} from './question.entity';
import {CreateQuestionDto} from './create-question.dto';
import {ApiImplicitParam, ApiUseTags} from '@nestjs/swagger';

@ApiUseTags('question')
@Controller('question')
export class QuestionsController {

    constructor(private readonly service: QuestionsService) {
    }

    @ApiImplicitParam({name: 'predictionid'})
    @Get('prediction/:predictionid')
    async findMatchesByPredictionId(@Param('predictionid') predictionid): Promise<Question[]> {
        return this.service.findQuestionsByPredictionId(predictionid);
    }

    @Post()
    async create(@Req() req, @Body() createQuestionDto: CreateQuestionDto[]) {
        return await this.service.create(createQuestionDto)
    }
}
