import { Test, TestingModule } from '@nestjs/testing';
import { ParentRecordsService } from './parent-records.service';

describe('ParentRecordsService', () => {
  let service: ParentRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParentRecordsService],
    }).compile();

    service = module.get<ParentRecordsService>(ParentRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
