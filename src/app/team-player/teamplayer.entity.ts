import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {Team} from '../team/team.entity';
import {Teamprediction} from '../team-prediction/team-prediction.entity';
import {Player} from '../player/player.entity';
import {Teamplayerscores, TeamplayerScoresResponse} from '../team-player-scores/teamplayerscores.entity';


export enum Position {
    Keeper = 'Goalkeeper',
    Defender = 'Defender',
    Midfielder = 'Midfielder',
    Forward = 'Attacker'
}

@Entity()
@Unique(['player', 'team', 'prediction'])
export class Teamplayer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: Position,
        nullable: true
    })
    position: Position;

    @ManyToOne(type => Player, player => player.teamPlayers)
    player: Player;

    @Column({default: true})
    active: boolean;

    @OneToMany(type => Teamprediction, prediction => prediction.teamPlayer)
    teamPredictions: Teamprediction[];

    @OneToMany(type => Teamplayerscores, tpscores => tpscores.teamPlayer)
    teamplayerscores: Teamplayerscores[];

    @ManyToOne(type => Competition, competition => competition.predictions)
    competition: Competition;

    @ManyToOne(type => Prediction, prediction => prediction.teamplayer)
    prediction: Prediction;

    @ManyToOne(type => Team, team => team.teamPlayer)
    team: Team;

}

export interface TeamplayerResponse {
    id: string;
    position: Position;
    player: Player;
    active: boolean;
    teamPredictions: Teamprediction[];
    teamplayerscores: TeamplayerScoresResponse;
    competition: Competition;
    prediction: Prediction;
    team: Team;

}
