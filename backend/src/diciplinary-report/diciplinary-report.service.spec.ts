import { Test, TestingModule } from '@nestjs/testing';
import { DiciplinaryReportService } from './diciplinary-report.service';

describe('DiciplinaryReportService', () => {
  let service: DiciplinaryReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiciplinaryReportService],
    }).compile();

    service = module.get<DiciplinaryReportService>(DiciplinaryReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
