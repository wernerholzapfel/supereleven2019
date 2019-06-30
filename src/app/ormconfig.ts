import 'dotenv/config';
import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import {Headline} from './headlines/headline.entity';
import {Participant} from './participant/participant.entity';
import {Competition} from './competitions/competition.entity';
import {Prediction} from './prediction/prediction.entity';
import {RankingPrediction} from './rankingPredictions/rankingPredictions.entity';
import {Team} from './teams/team.entity';
import {RankingTeam} from './rankingTeams/rankingTeam.entity';
import {Match} from './match/match.entity';
import {MatchPrediction} from './match-prediction/match-prediction.entity';
import {Question} from './questions/question.entity';
import {QuestionPrediction} from './questions-prediction/question-prediction.entity';

// @ts-ignore
export const ormconfig: TypeOrmModuleOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL,
    entities: [
        Competition,
        Headline,
        Participant,
        Prediction,
        RankingPrediction,
        RankingTeam,
        Team,
        Match,
        MatchPrediction,
        Question,
        QuestionPrediction
    ],
    logging: true,
    synchronize: true, // DEV only, do not use on PROD!
};
