import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Competition} from '../competitions/competition.entity';

@Entity()
export class Headline {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    title: string;

    @Column('text')
    text: string;

    @Column('text')
    schrijver: string;

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;

    @Column({default: true})
    isActive: boolean;

    @ManyToOne(type => Competition, competition => competition.headlines)
    competition: Competition;

}

export class HeadlineRead extends Headline {
}
