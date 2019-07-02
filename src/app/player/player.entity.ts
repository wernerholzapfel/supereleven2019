import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Teamprediction} from '../team-prediction/team-prediction.entity';
import {Teamplayer} from '../team-player/teamplayer.entity';

@Entity()
export class Player {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    firstname: string;

    @Column('text', {nullable: true})
    lastname: string;

    @OneToMany(type => Teamplayer, teamplayer => teamplayer.player)
    teamPlayers: Teamplayer[];
}
