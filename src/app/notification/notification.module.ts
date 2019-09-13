import {HttpModule, Module} from '@nestjs/common';
import {NotificationController} from './notification.controller';
import {NotificationService} from './notification.service';

@Module({
    imports: [
        NotificationModule,
        HttpModule],
    controllers: [NotificationController],
    providers: [NotificationService]
})
export class NotificationModule {
}
