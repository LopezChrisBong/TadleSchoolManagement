import { Test, TestingModule } from '@nestjs/testing';
import { EnrollStudentService } from './enroll-student.service';

describe('EnrollStudentService', () => {
  let service: EnrollStudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollStudentService],
    }).compile();

    service = module.get<EnrollStudentService>(EnrollStudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
