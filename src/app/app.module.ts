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
import {RankingPredictionsModule} from './ranking-prediction/rankingPredictions.module';
import {TeamModule} from './team/team.module';
import {RankingTeamModule} from './ranking-team/rankingTeam.module';
import {MatchPredictionModule} from './match-prediction/match-prediction.module';
import {MatchModule} from './match/match.module';
import {QuestionsModule} from './question/questions.module';
import {QuestionsPredictionModule} from './question-prediction/questions-prediction.module';
import {PlayerModule} from './player/player.module';
import {TeamPredictionModule} from './team-prediction/team-prediction.module';
import {TeamPlayerModule} from './team-player/team-player.module';
import { RoundModule } from './round/round.module';

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
        PlayerModule,
        TeamPredictionModule,
        TeamPlayerModule,
        RoundModule,
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
            {path: '/rankingprediction/competitionid/**', method: RequestMethod.GET},
            {path: '/team-prediction/prediction/**', method: RequestMethod.GET});
    }
}
