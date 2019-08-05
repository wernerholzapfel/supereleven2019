import {Controller, Get, Param} from '@nestjs/common';
import {TeamPlayerService} from './team-player.service';
import {Teamplayer} from './teamplayer.entity';
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
    async findAllForRoundId(@Param('predictionid') predictionId, @Param('roundid') roundId): Promise<Teamplayer[]> {
        return this.service.getTeamplayersWithScoresForRound(predictionId, roundId);
    }
}
