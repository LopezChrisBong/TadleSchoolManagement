import { Injectable } from '@nestjs/common';
import { CreateDiciplinaryReportDto } from './dto/create-diciplinary-report.dto';
import { UpdateDiciplinaryReportDto } from './dto/update-diciplinary-report.dto';

@Injectable()
export class DiciplinaryReportService {
  create(createDiciplinaryReportDto: CreateDiciplinaryReportDto) {
    return 'This action adds a new diciplinaryReport';
  }

  findAll() {
    return `This action returns all diciplinaryReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} diciplinaryReport`;
  }

  update(id: number, updateDiciplinaryReportDto: UpdateDiciplinaryReportDto) {
    return `This action updates a #${id} diciplinaryReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} diciplinaryReport`;
  }
}
