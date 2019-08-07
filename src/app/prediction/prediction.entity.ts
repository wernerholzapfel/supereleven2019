import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {PredictionType} from './create-prediction.dto';
import {Competition} from '../competitions/competition.entity';
import {RankingTeam} from '../ranking-team/rankingTeam.entity';
import {Match} from '../match/match.entity';
import {Teamplayer} from '../team-player/teamplayer.entity';
import {Round} from '../round/round.entity';

@Entity()
export class Prediction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: PredictionType,
    })
    predictionType: PredictionType;

    @ManyToOne(type => Competition, competition => competition.predictions)
    competition: Competition;

    @ManyToOne(type => RankingTeam, rankingTeam => rankingTeam.prediction)
    rankingTeam: RankingTeam;

    @ManyToOne(type => Teamplayer, teamPlayer => teamPlayer.prediction)
    teamplayer: Teamplayer;

    @ManyToOne(type => Match, match => match.prediction)
    match: Match;

    @OneToMany(type => Prediction, prediction => prediction.competition)
    predictions: Prediction[];

    @OneToMany(type => Round, round => round.prediction)
    rounds: Round[];

}

export class PredictionRead extends Prediction {
}
