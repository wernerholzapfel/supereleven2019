import {Body, Controller, Get, Param, Post, Req} from '@nestjs/common';
import {MatchService} from './match.service';
import {Match} from './match.entity';
import {CreateMatchDto} from './create-match.dto';
import {ApiImplicitParam, ApiUseTags} from '@nestjs/swagger';

@ApiUseTags('match')
@Controller('match')
export class MatchController {
    constructor(private readonly service: MatchService) {
    }

    @ApiImplicitParam({name: 'predictionid'})
    @Get('prediction/:predictionid')
    async findMatchesByPredictionId(@Param('predictionid') predictionid): Promise<Match[]> {
        return this.service.findMatchesByPredictionId(predictionid);
    }

    @Post()
    async create(@Req() req, @Body() createMatchDto: CreateMatchDto) {
        return await this.service.create(createMatchDto)
    }

}
