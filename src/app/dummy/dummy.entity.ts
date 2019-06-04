import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Dummy {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    dummy: string;

}

export class DummyRead extends Dummy {
}
