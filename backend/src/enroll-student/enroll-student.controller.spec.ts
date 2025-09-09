import { Test, TestingModule } from '@nestjs/testing';
import { EnrollStudentController } from './enroll-student.controller';
import { EnrollStudentService } from './enroll-student.service';

describe('EnrollStudentController', () => {
  let controller: EnrollStudentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollStudentController],
      providers: [EnrollStudentService],
    }).compile();

    controller = module.get<EnrollStudentController>(EnrollStudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
