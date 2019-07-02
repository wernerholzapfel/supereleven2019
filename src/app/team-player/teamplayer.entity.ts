import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Competition} from '../competitions/competition.entity';
import {Prediction} from '../prediction/prediction.entity';
import {Team} from '../team/team.entity';
import {Teamprediction} from '../team-prediction/team-prediction.entity';
import {Player} from '../player/player.entity';


export enum Position {
    Keeper = 'Keeper',
    Defender = 'Defender',
    Midfielder = 'Midfielder',
    Forward = 'Forward'
}

@Entity()
export class Teamplayer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: Position,
    })
    position: Position;

    @ManyToOne(type => Player, player => player.teamPlayers)
    player: Player;

    @Column({default: true})
    active: boolean;

    @OneToMany(type => Teamprediction, prediction => prediction.teamPlayer)
    teamPredictions: Teamprediction[];

    @ManyToOne(type => Competition, competition => competition.predictions)
    competition: Competition;

    @ManyToOne(type => Prediction, prediction => prediction.teamplayer)
    prediction: Prediction;

    @ManyToOne(type => Team, team => team.teamPlayer)
    team: Team;


}
