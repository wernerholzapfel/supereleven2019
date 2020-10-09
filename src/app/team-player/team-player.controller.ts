import {Body, Controller, Get, Param, Post, Put, Req} from '@nestjs/common';
import {TeamPlayerService} from './team-player.service';
import {Teamplayer, TeamplayerResponse} from './teamplayer.entity';
import {ApiImplicitParam, ApiUseTags} from '@nestjs/swagger';
import admin from 'firebase-admin';

@ApiUseTags('team-player')
@Controller('team-player')
export class TeamPlayerController {
    constructor(private readonly service: TeamPlayerService) {
    }

    @Put(':playerId')
    async updatePlayer(@Param('playerId') playerId, @Body() teamplayer: Teamplayer) {
        return this.service.updatePlayer(playerId, teamplayer);
    }

    @ApiImplicitParam({name: 'predictionid'})
    @Get('prediction/:predictionid')
    async findAll(@Param('predictionid') predictionId): Promise<Teamplayer[]> {
        return this.service.getAllByPredictionId(predictionId);
    }

    @ApiImplicitParam({name: 'roundid'})
    @Get('stats/prediction/:predictionid/round/:roundid')
    async getStatsForRound(@Param('predictionid') predictionId, @Param('roundid') roundId): Promise<any[]> {
        return this.service.getStatsForRound(predictionId, roundId);
    }

    @ApiImplicitParam({name: 'roundid'})
    @Get('prediction/:predictionid/round/:roundid')
    async findAllForRoundId(@Param('predictionid') predictionId, @Param('roundid') roundId): Promise<TeamplayerResponse[]> {
        return this.service.getTeamplayersWithScoresForRound(predictionId, roundId);
    }

    @Get('prediction/:predictionid/stats')
    async stats(@Param('predictionid') predictionId): Promise<any[]> {
        return this.service.getStats(predictionId);
    }

    @Post('stats')
    async createStats(@Req() req, @Body() body: {competitionId: string, predictionId: string}) {
        return await this.service.createStats(body.competitionId, body.predictionId);
    }

    @Post('roundstats')
    async createStatsForRound(@Req() req, @Body() body: {competitionId: string, predictionId: string, roundId}) {
        return await this.service.createStatsForRound(body.competitionId, body.predictionId, body.roundId);
    }

}
