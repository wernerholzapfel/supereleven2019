import {Logger, MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ormconfig} from './ormconfig';
import {TypeOrmModule} from '@nestjs/typeorm';
import {HeadlineModule} from './headlines/headline.module';
import {ParticipantModule} from './participant/participant.module';
import {
    AddFireBaseUserToRequest,
    AdminMiddleware,
    CanSavePrediction,
    IsRegistrationClosed
} from './authentication.middleware';
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
import {RoundModule} from './round/round.module';
import {TeamPlayerScoresModule} from './team-player-scores/team-player-scores.module';
import {StandModule} from './stand/stand.module';
import {NotificationModule} from './notification/notification.module';

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
        NotificationModule,
        QuestionsModule,
        QuestionsPredictionModule,
        PlayerModule,
        TeamPredictionModule,
        TeamPlayerModule,
        RoundModule,
        TeamPlayerScoresModule,
        StandModule
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
            {path: '/team-prediction/prediction/**', method: RequestMethod.GET},
            {path: '/question-prediction/prediction/**', method: RequestMethod.GET},
            {path: '/match-prediction/prediction/**', method: RequestMethod.GET},
            {path: '/participants/loggedIn', method: RequestMethod.GET});

        consumer.apply(IsRegistrationClosed).forRoutes(
            {path: '/stand/match/prediction/**', method: RequestMethod.GET},
            {path: '/team-prediction/prediction/**/stand', method: RequestMethod.GET},
            {path: '/team-player/prediction/**/stats', method: RequestMethod.GET}
        );

        consumer.apply(CanSavePrediction).forRoutes(
            {path: 'question-prediction/**', method: RequestMethod.POST},
            {path: 'match-prediction/**', method: RequestMethod.POST},
            {path: 'rankingprediction/**', method: RequestMethod.POST},
        );
            consumer.apply(AdminMiddleware).forRoutes(
            {path: 'competition/**', method: RequestMethod.POST},
            {path: 'headlines', method: RequestMethod.POST},
            {path: 'notification', method: RequestMethod.POST},
            {path: 'match', method: RequestMethod.POST},
            {path: 'player/**', method: RequestMethod.POST},
            {path: 'predictions', method: RequestMethod.POST},
            {path: 'question', method: RequestMethod.POST},
            {path: 'rankingteam', method: RequestMethod.POST},
            {path: 'round/**', method: RequestMethod.POST},
            {path: 'team', method: RequestMethod.POST},
            {path: 'teamplayer-scores', method: RequestMethod.POST},
            {path: 'team-prediction/stand/**', method: RequestMethod.POST},
            {path: 'team-prediction/roundstand/**', method: RequestMethod.POST},
            {path: 'team-player/stats/**', method: RequestMethod.POST},
            {path: 'team-player/roundstats/**', method: RequestMethod.POST},
        );

        // admin.auth().setCustomUserClaims('YWl0nRAHkCOQBqEj6MdG51n9pjT2', {admin: true}).then(() => {
        //     this.logger.log('customerset');
        // });
    }

}
