import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Dummy} from './dummy.entity';
import {DummyService} from './dummy.service';
import {DummyController} from './dummy.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Dummy]),
        DummyModule],
    providers: [DummyService],
    controllers: [DummyController],
})
export class DummyModule {
}