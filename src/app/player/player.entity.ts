import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn} from 'typeorm';
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

    @Column({default: false})
    isDeleted: boolean;

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;

    @OneToMany(type => Teamplayer, teamplayer => teamplayer.player)
    teamPlayers: Teamplayer[];
}
