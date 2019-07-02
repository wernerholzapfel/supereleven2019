import { Test, TestingModule } from '@nestjs/testing';
import { TeamPredictionController } from './team-prediction.controller';

describe('TeamPrediction Controller', () => {
  let controller: TeamPredictionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamPredictionController],
    }).compile();

    controller = module.get<TeamPredictionController>(TeamPredictionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
