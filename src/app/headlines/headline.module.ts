import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {HeadlineService} from './headline.service';
import {Headline} from './headline.entity';
import {HeadlinesController} from './headlines.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Headline]),
        HeadlineModule],
    providers: [HeadlineService],
    controllers: [HeadlinesController],
})
export class HeadlineModule {
}