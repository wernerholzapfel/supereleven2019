import {Body, Controller, Post, Req} from '@nestjs/common';
import {ApiUseTags} from '@nestjs/swagger';
import {NotificationService} from './notification.service';

@ApiUseTags('notification')
@Controller('notification')
export class NotificationController {
    constructor(private readonly service: NotificationService) {
    }

    @Post()
    async create(@Req() req, @Body() createNotification: any) {
        return await this.service.create(createNotification)
    }

}
