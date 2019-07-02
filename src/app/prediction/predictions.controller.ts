import {Body, Controller, Get, Logger, Param, Post, Req} from '@nestjs/common';
import {PredictionService} from './prediction.service';
import {Competition} from '../competitions/competition.entity';
import {CreatePredictionDto} from './create-prediction.dto';
import {Prediction} from './prediction.entity';
import {ApiUseTags} from '@nestjs/swagger';

@ApiUseTags('predictions')
@Controller('predictions')
export class PredictionsController {
    private readonly logger = new Logger('PredictionsController', true);

    constructor(private readonly predictionService: PredictionService) {
    }

    @Get()
    async findAll(): Promise<Prediction[]> {
        return this.predictionService.getAll();
    }

    @Post()
    async create(@Req() req, @Body() createPredictionDto: CreatePredictionDto) {
        this.logger.log('post competition');
        const newObject = Object.assign({}, createPredictionDto);
        return await this.predictionService.create(newObject);
    }
}