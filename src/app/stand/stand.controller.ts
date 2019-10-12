import {Body, Controller, Get, Logger, Param, Post, Req} from '@nestjs/common';
import {ApiImplicitParam, ApiUseTags} from '@nestjs/swagger';
import {StandService} from './stand.service';
import admin from 'firebase-admin';
import DataSnapshot = admin.database.DataSnapshot;
import {CreateHeadlineDto} from '../headlines/create-headline.dto';
import {Prediction} from '../prediction/prediction.entity';
import {Competition} from '../competitions/competition.entity';

@ApiUseTags('stand')
@Controller('stand')
export class StandController {
    private readonly logger = new Logger('StandController', true);

    constructor(private readonly service: StandService) {
    }

    // todo weggooien na uitrol
    @ApiImplicitParam({name: 'predictionId'})
    @Get('match/prediction/:predictionId')
    async findAll(@Param('predictionId') predictionId): Promise<any[]> {
        return this.service.getMatchStand(predictionId);
    }

    @ApiImplicitParam({name: 'predictionId'})
    @Post('match/create')
    async create(@Req() req, @Body() body: {competitionId: string, predictionId: string}) {
        return this.service.createMatchStand(body.competitionId, body.predictionId);
    }

    @ApiImplicitParam({name: 'predictionId'})
    @Post('total/create')
    async createTotalStand(@Req() req, @Body() body: {competitionId}) {
        return this.service.createTotalStand(body.competitionId);
    }

    @ApiImplicitParam({name: 'competitionId'})
    @Get('totaal/competition/:competitionId')
    async getTotalStand(@Param('competitionId') competitionId): Promise<any> {
        return this.service.getTotalStand(competitionId);
    }
}
