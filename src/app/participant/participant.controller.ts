import {Body, Controller, Get, Logger, Param, Post, Req} from '@nestjs/common';
import {ParticipantService} from './participant.service';
import {CreateParticipantDto} from './create-participant.dto';
import {Headline} from '../headlines/headline.entity';
import {RankingPrediction} from '../ranking-prediction/rankingPredictions.entity';
import {Participant} from './participant.entity';

@Controller('participant')
export class ParticipantController {
    private readonly logger = new Logger('ParticipantController', true);

    constructor(private readonly participantService: ParticipantService) {
    }

    @Get(':participantId/competition/:competitionId')
    async findAll(@Param('participantId') participantId, @Param('competitionId') competitionId): Promise<Participant> {
        return this.participantService.getParticipantPrediction(participantId, competitionId);
    }
    @Post()
    async create(@Req() req, @Body() createParticipantDto: CreateParticipantDto) {
        this.logger.log('post participant');
        const newParticipant = Object.assign({}, createParticipantDto);
        return await this.participantService.create(newParticipant, req.user.email, req.user.uid);
    }
}