import {HttpModule, Module} from '@nestjs/common';
import {NotificationController} from './notification.controller';
import {NotificationService} from './notification.service';
import {OneSignalModule} from 'onesignal-api-client-nest';

@Module({
    imports: [
        NotificationModule,
        OneSignalModule.forRoot({
            appId: process.env.onesignal_appid,
            restApiKey: process.env.onesignal_apikey,
        }),
        HttpModule],
    controllers: [NotificationController],
    providers: [NotificationService]
})
export class NotificationModule {
}
