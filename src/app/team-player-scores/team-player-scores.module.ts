import {Module} from '@nestjs/common';
import {TeamplayerScoresController} from './teamplayer-scores.controller';
import {TeamPlayerScoresService} from './team-player-scores.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Teamplayerscores} from './teamplayerscores.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Teamplayerscores]),
        TeamPlayerScoresModule],
    controllers: [TeamplayerScoresController],
    providers: [TeamPlayerScoresService]
})
export class TeamPlayerScoresModule {
}
