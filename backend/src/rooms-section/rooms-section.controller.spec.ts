import { Test, TestingModule } from '@nestjs/testing';
import { RoomsSectionController } from './rooms-section.controller';
import { RoomsSectionService } from './rooms-section.service';

describe('RoomsSectionController', () => {
  let controller: RoomsSectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomsSectionController],
      providers: [RoomsSectionService],
    }).compile();

    controller = module.get<RoomsSectionController>(RoomsSectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
