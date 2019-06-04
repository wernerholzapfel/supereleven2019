import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {PredictionType} from './create-prediction.dto';
import {Competition} from '../competitions/competition.entity';

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

}

export class PredictionRead extends Prediction {
}
