import {Body, Controller, Get, Logger, Param, Post, Req} from '@nestjs/common';
import {TeamPredictionService} from './team-prediction.service';
import {Teamprediction} from './team-prediction.entity';
import {CreateTeamPredictionDto} from './create-team-prediction.dto';
import {ApiImplicitParam, ApiUseTags} from '@nestjs/swagger';
import {Participant} from '../participant/participant.entity';

@ApiUseTags('team-prediction')
@Controller('team-prediction')
export class TeamPredictionController {
    private readonly logger = new Logger('TeamPredictionController', true);

    constructor(private readonly service: TeamPredictionService) {
    }

    @ApiImplicitParam({name: 'predictionid'})
    @Get('prediction/:predictionid')
    async findAll(@Param('predictionid') predictionId, @Req() req,): Promise<Teamprediction[]> {
        return this.service.getAll(predictionId, req.user.uid);
    }

    @Post()
    async create(@Req() req, @Body() createDto: CreateTeamPredictionDto[]) {
        return await this.service.create(createDto, req.user.uid);
    }

    @Get('prediction/:predictionid/stand')
    async getStand(@Param('predictionid') predictionId, @Req() req,): Promise<any[]> {
        return this.service.getStand(predictionId);
    }

    @Get('prediction/:predictionid/round/:roundid/stand')
    async getRoundStand(@Param('predictionid') predictionId, @Param('roundid') roundId, @Req() req,): Promise<any[]> {
        return this.service.getRoundStand(predictionId, roundId);
    }

}
