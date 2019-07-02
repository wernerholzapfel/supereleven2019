import { Test, TestingModule } from '@nestjs/testing';
import { TeamPredictionService } from './team-prediction.service';

describe('TeamPredictionService', () => {
  let service: TeamPredictionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamPredictionService],
    }).compile();

    service = module.get<TeamPredictionService>(TeamPredictionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
