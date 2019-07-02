import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Match} from '../match/match.entity';
import {Question} from './question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]),
    QuestionsModule],
  controllers: [QuestionsController],
  providers: [QuestionsService]
})
export class QuestionsModule {}
