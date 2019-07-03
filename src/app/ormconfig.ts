import 'dotenv/config';
import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import {Headline} from './headlines/headline.entity';
import {Participant} from './participant/participant.entity';
import {Competition} from './competitions/competition.entity';
import {Prediction} from './prediction/prediction.entity';
import {RankingPrediction} from './ranking-prediction/rankingPredictions.entity';
import {Team} from './team/team.entity';
import {RankingTeam} from './ranking-team/rankingTeam.entity';
import {Match} from './match/match.entity';
import {MatchPrediction} from './match-prediction/match-prediction.entity';
import {Question} from './question/question.entity';
import {QuestionPrediction} from './question-prediction/question-prediction.entity';
import {Player} from './player/player.entity';
import {Teamplayer} from './team-player/teamplayer.entity';
import {Teamprediction} from './team-prediction/team-prediction.entity';
import {Round} from './round/round.entity';

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
        QuestionPrediction,
        Player,
        Teamplayer,
        Teamprediction,
        Round,
    ],
    logging: true,
    synchronize: true, // DEV only, do not use on PROD!
};
