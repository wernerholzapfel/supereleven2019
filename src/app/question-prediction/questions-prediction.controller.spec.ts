import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsPredictionController } from './questions-prediction.controller';

describe('QuestionsPrediction Controller', () => {
  let controller: QuestionsPredictionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsPredictionController],
    }).compile();

    controller = module.get<QuestionsPredictionController>(QuestionsPredictionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
