import { Test, TestingModule } from '@nestjs/testing';
import { MatchPredictionService } from './match-prediction.service';

describe('MatchPredictionService', () => {
  let service: MatchPredictionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchPredictionService],
    }).compile();

    service = module.get<MatchPredictionService>(MatchPredictionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
