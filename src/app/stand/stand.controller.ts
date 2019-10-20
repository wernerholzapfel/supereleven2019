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

    // todo weggooien wordt niet meer gebruikt sinds 4.6.0
    @ApiImplicitParam({name: 'predictionId'})
    @Get('match/prediction/:predictionId')
    async findAll(@Param('predictionId') predictionId): Promise<any[]> {
        return this.service.getMatchStand(predictionId);
    }

    // todo weggooien wordt niet meer gebruikt sinds 4.6.0
    @ApiImplicitParam({name: 'predictionId'})
    @Get('ranking/prediction/:predictionId')
    async getRankingStand(@Param('predictionId') predictionId): Promise<any[]> {
        return this.service.getRankingStand(predictionId);
    }

    // todo weggooien wordt niet meer gebruikt sinds 4.6.0
    @ApiImplicitParam({name: 'competitionId'})
    @Get('totaal/competition/:competitionId')
    async getTotalStand(@Param('competitionId') competitionId): Promise<any> {
        return this.service.getTotalStand(competitionId);
    }
    @ApiImplicitParam({name: 'predictionId'})
    @Post('match/create')
    async createMatchStand(@Req() req, @Body() body: {competitionId: string, predictionId: string}) {
        return this.service.createMatchStand(body.competitionId, body.predictionId);
    }

    @ApiImplicitParam({name: 'predictionId'})
    @Post('ranking/create')
    async createRankingStand(@Req() req, @Body() body: {competitionId: string, predictionId: string}) {
        return this.service.createRankingStand(body.competitionId, body.predictionId);
    }

    @ApiImplicitParam({name: 'competitionId'})
    @Post('total/create')
    async createTotalStand(@Req() req, @Body() body: {competitionId}) {
        return this.service.createTotalStand(body.competitionId);
    }
}
