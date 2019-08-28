import {Controller, Get, Logger, Param} from '@nestjs/common';
import {ApiImplicitParam, ApiUseTags} from '@nestjs/swagger';
import {RoundService} from './round.service';
import {Round} from './round.entity';

@ApiUseTags('round')
@Controller('round')
export class RoundController {
    private readonly logger = new Logger('RoundController', true);

    constructor(private readonly service: RoundService) {
    }

    @Get('next')
    async getNextRound(): Promise<Round> {
        return this.service.getNextRound();
    }

    @Get('previous')
    async getPreviousRound(): Promise<Round> {
        return this.service.getPreviousRound();
    }

    @ApiImplicitParam({name: 'competitionid'})
    @Get('competition/:competitionid')
    async findAll(@Param('competitionid') competitionid): Promise<Round[]> {
        return this.service.getAll(competitionid);
    }
}
