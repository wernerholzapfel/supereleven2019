import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Participant} from './participant.entity';
import {ParticipantService} from './participant.service';
import {ParticipantController} from './participant.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Participant])],
    providers: [ParticipantService],
    controllers: [ParticipantController],
})
export class ParticipantModule {}