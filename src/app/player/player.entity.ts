import {Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from 'typeorm';
import {Position, Teamplayer} from '../team-player/teamplayer.entity';

@Entity()
@Unique(["playerReference", "teamReference"])
export class Player {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int')
    playerReference: number;

    @Column('int')
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

    @Column({nullable: true,
        type: 'text',
    })
    position: string;

    @OneToMany(type => Teamplayer, teamplayer => teamplayer.player)
    teamPlayers: Teamplayer[];
}
