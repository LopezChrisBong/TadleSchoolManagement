import { Test, TestingModule } from '@nestjs/testing';
import { ESigsController } from './e-sigs.controller';
import { ESigsService } from './e-sigs.service';

describe('ESigsController', () => {
  let controller: ESigsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ESigsController],
      providers: [ESigsService],
    }).compile();

    controller = module.get<ESigsController>(ESigsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
