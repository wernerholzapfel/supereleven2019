import {Logger, MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ormconfig} from './ormconfig';
import {TypeOrmModule} from '@nestjs/typeorm';
import {HeadlineModule} from './headlines/headline.module';
import {ParticipantModule} from './participant/participant.module';
import {AddFireBaseUserToRequest} from './authentication.middleware';
import {CompetitionModule} from './competitions/competition.module';
import {PredictionModule} from './prediction/prediction.module';
import {RankingPredictionsModule} from './rankingPredictions/rankingPredictions.module';
import {TeamModule} from './teams/team.module';
import {RankingTeamModule} from './rankingTeams/rankingTeam.module';
import { MatchPredictionModule } from './match-prediction/match-prediction.module';
import {MatchModule} from './match/match.module';
import { QuestionsModule } from './questions/questions.module';
import { QuestionsPredictionModule } from './questions-prediction/questions-prediction.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(ormconfig),
        CompetitionModule,
        HeadlineModule,
        ParticipantModule,
        PredictionModule,
        RankingPredictionsModule,
        RankingTeamModule,
        TeamModule,
        MatchPredictionModule,
        MatchModule,
        QuestionsModule,
        QuestionsPredictionModule,
    ],
    controllers: [
        AppController],
    providers: [
        AppService],
})
export class AppModule {

    private readonly logger = new Logger('AppModule', true);

    configure(consumer: MiddlewareConsumer): void {

        consumer.apply(AddFireBaseUserToRequest).forRoutes(
            {path: '/**', method: RequestMethod.POST},
            {path: '/rankingprediction/competitionid/**', method: RequestMethod.GET});
    }
}
