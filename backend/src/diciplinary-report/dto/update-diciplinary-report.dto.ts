import { PartialType } from '@nestjs/swagger';
import { CreateDiciplinaryReportDto } from './create-diciplinary-report.dto';

export class UpdateDiciplinaryReportDto extends PartialType(CreateDiciplinaryReportDto) {}
