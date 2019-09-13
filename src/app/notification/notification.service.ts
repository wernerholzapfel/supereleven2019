import {HttpService, Injectable, Logger} from '@nestjs/common';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger('NotificationService', true);

    constructor() {
    }

    apikey = process.env.onesignal_apikey;

    async create(item: any): Promise<any> {
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Basic ${this.apikey}`
        };

        const options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };

        const https = require('https');
        const req = https.request(options, function(res) {
            res.on('data', function(data) {
                console.log("Response:");
                console.log(JSON.parse(data));
            });
        });

        req.on('error', function(e) {
            console.log("ERROR:");
            console.log(e);
        });

        req.write(JSON.stringify({
            'app_id': 'eb25a650-dde9-4137-9b48-e4e1323c93a7',
            'included_segments': ['werner'],
            'contents': {'en': item.content}
        }));
        req.end();
    };
}
