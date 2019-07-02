import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsPredictionService } from './questions-prediction.service';

describe('QuestionsPredictionService', () => {
  let service: QuestionsPredictionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionsPredictionService],
    }).compile();

    service = module.get<QuestionsPredictionService>(QuestionsPredictionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
