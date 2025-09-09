import { Test, TestingModule } from '@nestjs/testing';
import { DiciplinaryReportController } from './diciplinary-report.controller';
import { DiciplinaryReportService } from './diciplinary-report.service';

describe('DiciplinaryReportController', () => {
  let controller: DiciplinaryReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiciplinaryReportController],
      providers: [DiciplinaryReportService],
    }).compile();

    controller = module.get<DiciplinaryReportController>(DiciplinaryReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
