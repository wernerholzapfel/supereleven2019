import {HttpException, HttpService, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Player} from './player.entity';
import {concatAll, concatMap, delay, map, mergeMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Team} from '../team/team.entity';
import {Teamplayer} from '../team-player/teamplayer.entity';

@Injectable()
export class PlayerService {
    private readonly logger = new Logger('PlayerService', true);

    constructor(private http: HttpService,
                private readonly connection: Connection,
                @InjectRepository(Player)
                private readonly repository: Repository<Player>) {
    }

    async getAll(): Promise<Player[]> {
        return await this.connection
            .getRepository(Player)
            .createQueryBuilder('players')
            .getMany();
    }

    async updateplayersforprediction(predictionId: string) {
        const dbTeams = await this.connection
            .getRepository(Team)
            .createQueryBuilder('teams')
            .getMany();

        const dbPlayers = await this.connection
            .getRepository(Player)
            .createQueryBuilder('player')
            .getMany();

        const teamplayers = await this.connection
            .getRepository(Teamplayer)
            .createQueryBuilder('teamplayer')
            .leftJoinAndSelect('teamplayer.player', 'player')
            .getMany();

        const mappedPlayerList: any[] = await dbPlayers
            // if position is unknown or player already exists don't insert the player
            .filter(dbplayer => {
                return !teamplayers.find(tp => {
                    return tp.player.id === dbplayer.id
                })
            })
            .map(player => {
                return {
                    position: player.position,
                    active: true,
                    player: {id: player.id},
                    competition: {id: 'dd0c5fa2-9202-40e9-9505-ff8a3dbb6429'},
                    prediction: {id: 'a855cf19-195f-484e-88cc-c9dbc744ae98'},
                    team: {id: dbTeams.find(team => team.referenceId === player.teamReference).id}
                }
            });
        this.logger.log(dbPlayers.length);
        this.logger.log(teamplayers.length);
        this.logger.log(mappedPlayerList.length);
        return await this.connection.getRepository(Teamplayer)
            .createQueryBuilder()
            .insert()
            .into(Teamplayer)
            .values(mappedPlayerList)
            .returning(
                '*'
            )
            .execute()
            .catch(
                (err) => {
                    throw new HttpException({
                            message: err.message,
                            statusCode: HttpStatus.BAD_REQUEST,
                        }, HttpStatus.BAD_REQUEST
                    );
                }
            );
    }

    async updatePlayers() {

        const currentPlayers = await this.connection
            .getRepository(Player)
            .createQueryBuilder('players')
            .getMany();
        const headersRequest = {
            'X-Auth-Token': '0751cccb259a435195771bd1cbb1b4ac'
        };

        // teams ophalen voor huidige seizoen
        const teamIds: Observable<number[]> = await this.http.get('http://api.football-data.org/v2/competitions/2003/teams',
            {
                headers: headersRequest
            }).pipe(
            map(response => {
                // this.connection.getRepository(Team)
                //     .createQueryBuilder()
                //     .insert()
                //     .into(Team)
                //     .values(response.data.teams
                //         .map(team => {
                //             return {
                //                 name: team.shortName,
                //                 logoUrl: team.crestUrl,
                //                 referenceId: team.id,
                //             }
                //         }))
                //     .returning('*')
                //     .execute()
                //     .catch((err) => {
                //         throw new HttpException({
                //             message: err.message,
                //             statusCode: HttpStatus.BAD_REQUEST,
                //         }, HttpStatus.BAD_REQUEST);
                //     });

                return response.data.teams.map(team => team.id)
            }));

        // const teamIds = of([
        // //         666,
        // //         668,
        // //         671,
        // //         672,
        // //         673,
        // //         674,
        // //         675,
        // //         676,
        // //         677,
        // //         678,
        // //         679,
        // //         680,
        // //         682,
        // //         683,
        // //         684,
        // //         1914,
        //         1920,
        // //         6806
        //     ]
        // );
        //
        // per teamid de gegevens van t team ophalen;

        this.logger.log(teamIds);

        await teamIds.pipe(
            concatAll(),
            concatMap(a => of(a).pipe(delay(6000))),
            mergeMap(teamId => {
                return this.http.get('http://api.football-data.org/v2/teams/' + teamId, {headers: headersRequest})
                    .pipe(
                        map(response => {
                            this.logger.log('ik heb data opgehaald voor ' + teamId);
                            return response.data
                        }));
            }))
            .subscribe(teams => {
                //
                const update = teams.squad.filter(squadmember => {
                    return squadmember.role === 'PLAYER'
                        && !currentPlayers.find(cp => {
                            return cp.playerReference === squadmember.id
                                && cp.teamReference === teams.id
                        });
                })
                    .map(squad => {
                        this.logger.log(squad.name);
                        return {
                            playerReference: squad.id ? squad.id : 0,
                            teamReference: teams.id,
                            team: teams.shortName,
                            name: squad.name,
                            position: squad.position,
                            dateOfBirth: squad.dateOfBirth,
                            nationality: squad.nationality,
                            countryOfBirth: squad.countryOfBirth
                        };
                    });

                if (update.length > 0) {
                    this.logger.log(`add ${update.length} players`);
                    this.connection.getRepository(Player)
                        .createQueryBuilder()
                        .insert()
                        .into(Player)
                        .values(update)
                        .returning('*')
                        .execute()
                        .catch((err) => {
                            throw new HttpException({
                                message: err.message,
                                statusCode: HttpStatus.BAD_REQUEST,
                            }, HttpStatus.BAD_REQUEST);
                        });
                }
                else {
                    this.logger.log('geen nieuwe spelers gevonden');
                }
            });

    }
}
