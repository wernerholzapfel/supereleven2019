import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Participant} from './participant.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {CreateParticipantDto} from './create-participant.dto';
import {RankingPrediction} from '../ranking-prediction/rankingPredictions.entity';

@Injectable()
export class ParticipantService {

    private readonly logger = new Logger('ParticipantService', true);

    constructor(private readonly connection: Connection,
                @InjectRepository(Participant)
                private readonly participantRepository: Repository<Participant>) {
    }

    async getParticipantPrediction(participantId, competitionId): Promise<Participant> {
        return await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .leftJoinAndSelect('participant.rankingPredictions', 'rankingPredictions', 'participant.id = :participantId', {participantId})
            .leftJoinAndSelect('rankingPredictions.team', 'rankingTeam')
            .innerJoinAndSelect('rankingTeam.team', 'team')
            .where('participant.id = :id', {id: participantId})
            .getOne();
    }


    async create(participant: CreateParticipantDto, email: string, uid: string): Promise<Participant> {
        const newParticipant: Participant = Object.assign(participant);
        newParticipant.email = email.toLowerCase();
        newParticipant.firebaseIdentifier = uid;
        return await this.participantRepository.save(newParticipant)
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }
}