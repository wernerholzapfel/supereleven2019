import {Body, Controller, Get, Param, Post, Req} from '@nestjs/common';
import {QuestionsService} from './questions.service';
import {Question} from './question.entity';
import {CreateQuestionDto} from './create-question.dto';

@Controller('question')
export class QuestionsController {

    constructor(private readonly service: QuestionsService) {
    }

    @Get('prediction/:predictionid')
    async findMatchesByPredictionId(@Param('predictionid') predictionid): Promise<Question[]> {
        return this.service.findQuestionsByPredictionId(predictionid);
    }

    @Post()
    async create(@Req() req, @Body() createQuestionDto: CreateQuestionDto[]) {
        return await this.service.create(createQuestionDto)
    }
}
