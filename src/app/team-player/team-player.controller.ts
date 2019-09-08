import {Controller, Get, Param} from '@nestjs/common';
import {TeamPlayerService} from './team-player.service';
import {Teamplayer, TeamplayerResponse} from './teamplayer.entity';
import {ApiImplicitParam, ApiUseTags} from '@nestjs/swagger';

@ApiUseTags('team-player')
@Controller('team-player')
export class TeamPlayerController {
    constructor(private readonly service: TeamPlayerService) {
    }

    @ApiImplicitParam({name: 'predictionid'})
    @Get('prediction/:predictionid')
    async findAll(@Param('predictionid') predictionId): Promise<Teamplayer[]> {
        return this.service.getAllByPredictionId(predictionId);
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
}
