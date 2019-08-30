import {Controller, Get, Logger, Param} from '@nestjs/common';
import {ApiImplicitParam, ApiUseTags} from '@nestjs/swagger';
import {StandService} from './stand.service';

@ApiUseTags('stand')
@Controller('stand')
export class StandController {
    private readonly logger = new Logger('StandController', true);

    constructor(private readonly service: StandService) {
    }

    @ApiImplicitParam({name: 'predictionId'})
    @Get('match/prediction/:predictionId')
    async findAll(@Param('predictionId') predictionId): Promise<any[]> {
        return this.service.getMatchStand(predictionId);
    }
}
