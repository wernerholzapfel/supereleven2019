import {Module} from '@nestjs/common';
import {PlayerController} from './player.controller';
import {PlayerService} from './player.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Player} from './player.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Player]),
        PlayerModule],
    controllers: [PlayerController],
    providers: [PlayerService]
})
export class PlayerModule {
}
