import {Injectable, Logger} from '@nestjs/common';
import {OneSignalService} from 'onesignal-api-client-nest';
import {NotificationBySegmentBuilder} from 'onesignal-api-client-core';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger('NotificationService', true);

    constructor(private readonly oneSignalService: OneSignalService) {
    }

    async create(item: any): Promise<any> {
        const input = new NotificationBySegmentBuilder()
            .setIncludedSegments([process.env.onesignal_segment])
            .notification() // .email()
            .setContents({en: item.content})
            .build();

        return await this.oneSignalService.createNotification(input);

    };
}
