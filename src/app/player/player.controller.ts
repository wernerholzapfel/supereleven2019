import {Controller, Get} from '@nestjs/common';
import {PlayerService} from './player.service';
import {Player} from './player.entity';
import {ApiUseTags} from '@nestjs/swagger';


@ApiUseTags('player')
@Controller('player')
export class PlayerController {
    constructor(private readonly service: PlayerService) {
    }

    @Get()
    async findAll(): Promise<Player[]> {
        return this.service.getAll();
    }
}
