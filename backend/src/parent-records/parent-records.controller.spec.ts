import { Test, TestingModule } from '@nestjs/testing';
import { ParentRecordsController } from './parent-records.controller';
import { ParentRecordsService } from './parent-records.service';

describe('ParentRecordsController', () => {
  let controller: ParentRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentRecordsController],
      providers: [ParentRecordsService],
    }).compile();

    controller = module.get<ParentRecordsController>(ParentRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
