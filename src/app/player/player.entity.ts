import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Teamplayer} from '../team-player/teamplayer.entity';

@Entity()
export class Player {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int', {
        nullable: true
    })
    playerReference: number;

    @Column('int', {
        nullable: true
    })
    teamReference: number;

    @Column('text')
    team: number;

    @Column('text', {
        nullable: true
    })
    name: string;

    @Column('text', {
        nullable: true
    })
    dateOfBirth: string;

    @Column('text', {
        nullable: true
    })
    countryOfBirth: string;

    @Column('text', {
        nullable: true
    })
    nationality: string;

    @Column('text', {
        nullable: true
    })
    position: string;

    @OneToMany(type => Teamplayer, teamplayer => teamplayer.player)
    teamPlayers: Teamplayer[];
}
