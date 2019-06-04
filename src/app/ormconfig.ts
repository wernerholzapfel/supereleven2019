import 'dotenv/config';
import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import {Headline} from './headlines/headline.entity';
import {Participant} from './participant/participant.entity';
import {Competition} from './competitions/competition.entity';
import {Prediction} from './prediction/prediction.entity';
import {RankingPrediction} from './rankingPredictions/rankingPredictions.entity';
import {Team} from './teams/team.entity';
import {RankingTeam} from './rankingTeams/rankingTeam.entity';

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
    ],
    logging: true,
    synchronize: true, // DEV only, do not use on PROD!
};
