import {Body, Controller, Post, Req} from '@nestjs/common';
import {CreateRankingTeamDto} from '../ranking-team/create-rankingTeam.dto';
import {TeamPlayerScoresService} from './team-player-scores.service';
import {CreateTeamPredictionDto} from '../team-prediction/create-team-prediction.dto';

@Controller('teamplayer-scores')
export class TeamplayerScoresController {
    constructor(private service: TeamPlayerScoresService) {}

    @Post()
    async create(@Req() req, @Body() createDto: CreateTeamPredictionDto) {
        const newObject = Object.assign({}, createDto);
        return await this.service.create(newObject);
    }
}
