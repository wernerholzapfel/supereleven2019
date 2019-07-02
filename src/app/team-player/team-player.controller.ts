import {Controller, Get, Param} from '@nestjs/common';
import {TeamPlayerService} from './team-player.service';
import {Teamplayer} from './teamplayer.entity';

@Controller('team-player')
export class TeamPlayerController {
    constructor(private readonly service: TeamPlayerService) {
    }

    @Get('prediction/:predictionid')
    async findAll(@Param('predictionid') predictionId): Promise<Teamplayer[]> {
        return this.service.getAllByPredictionId(predictionId);
    }
}
