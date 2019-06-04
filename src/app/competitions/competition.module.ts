import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CompetitionService} from './competition.service';
import {CompetitionsController} from './competitions.controller';
import {Competition} from './competition.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Competition]),
        CompetitionModule],
    providers: [CompetitionService],
    controllers: [CompetitionsController],
})
export class CompetitionModule {
}