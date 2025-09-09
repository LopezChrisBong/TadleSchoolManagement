import { Test, TestingModule } from '@nestjs/testing';
import { RoomsSectionService } from './rooms-section.service';

describe('RoomsSectionService', () => {
  let service: RoomsSectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomsSectionService],
    }).compile();

    service = module.get<RoomsSectionService>(RoomsSectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
