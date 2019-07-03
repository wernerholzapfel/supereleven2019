import {Module} from '@nestjs/common';
import {RoundService} from './round.service';
import {RoundController} from './round.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Round} from './round.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Round]),
        RoundModule],
    providers: [RoundService],
    controllers: [RoundController]
})
export class RoundModule {
}
