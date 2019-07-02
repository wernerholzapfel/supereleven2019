import {Module} from '@nestjs/common';
import {TeamPlayerController} from './team-player.controller';
import {TeamPlayerService} from './team-player.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Teamplayer} from './teamplayer.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Teamplayer]),
        TeamPlayerModule],
    controllers: [TeamPlayerController],
    providers: [TeamPlayerService]
})
export class TeamPlayerModule {
}
