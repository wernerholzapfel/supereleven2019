import { Test, TestingModule } from '@nestjs/testing';
import { MatchPredictionController } from './match-prediction.controller';

describe('MatchPrediction Controller', () => {
  let controller: MatchPredictionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchPredictionController],
    }).compile();

    controller = module.get<MatchPredictionController>(MatchPredictionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
