import {Injectable, Logger, NestMiddleware} from '@nestjs/common';
import 'dotenv/config';
import * as admin from 'firebase-admin';

@Injectable()
export class AddFireBaseUserToRequest implements NestMiddleware {
    private readonly logger = new Logger('AddFireBaseUserToRequest', true);

    use(req, res, next) {
        const extractedToken = getToken(req.headers);
        if (extractedToken) {
            admin.auth().verifyIdToken(extractedToken)
                .then(decodedToken => {
                    const uid = decodedToken.uid;
                    this.logger.log('uid: ' + uid);
                    admin.auth().getUser(uid)
                        .then(userRecord => {
                            // See the UserRecord reference doc for the contents of userRecord.
                            this.logger.log('Successfully fetched user data for: ' + uid);
                            req.user = userRecord;
                            next();
                        })
                        .catch(error => {
                            this.logger.log('Error fetching user data:', error);
                        });
                }).catch(error => {
                this.logger.log('Error verify token:', error);
            });
        } else {
            next();
        }
    };
}

const getToken = headers => {
    if (headers && headers.authorization) {
        const parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};