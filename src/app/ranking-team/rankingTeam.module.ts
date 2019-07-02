import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RankingTeam} from './rankingTeam.entity';
import {RankingTeamController} from './rankingTeam.controller';
import {RankingTeamService} from './rankingTeam.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([RankingTeam]),
        RankingTeamModule],
    providers: [RankingTeamService],
    controllers: [RankingTeamController],
})
export class RankingTeamModule {
}
