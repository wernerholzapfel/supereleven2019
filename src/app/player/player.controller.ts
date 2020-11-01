import {Controller, Get, Logger, Post} from '@nestjs/common';
import {PlayerService} from './player.service';
import {Player} from './player.entity';
import {ApiUseTags} from '@nestjs/swagger';


@ApiUseTags('player')
@Controller('player')
export class PlayerController {
    private readonly logger = new Logger('PlayerController', true);

    constructor(private readonly service: PlayerService) {
        // this.update().then(result => {
        //     this.logger.log('update done');
        // });

        // this.updateplayersforprediction().then(result => {
        //     this.logger.log('update done');
        // });
    }

    @Get()
    async findAll(): Promise<Player[]> {
        return this.service.getAll();
    }

    @Post('update')
    async update() {
        this.logger.log('ol werner');
        return this.service.updatePlayers();
    }
    @Post('updateplayersforprediction')
    async updateplayersforprediction() {
        this.logger.log('ol werner');
        return this.service.updateplayersforprediction('a855cf19-195f-484e-88cc-c9dbc744ae98');
    }
}
