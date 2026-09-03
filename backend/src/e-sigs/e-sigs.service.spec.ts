import { Test, TestingModule } from '@nestjs/testing';
import { ESigsService } from './e-sigs.service';

describe('ESigsService', () => {
  let service: ESigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ESigsService],
    }).compile();

    service = module.get<ESigsService>(ESigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
