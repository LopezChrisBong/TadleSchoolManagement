import { Module } from '@nestjs/common';
import { DiciplinaryReportService } from './diciplinary-report.service';
import { DiciplinaryReportController } from './diciplinary-report.controller';

@Module({
  controllers: [DiciplinaryReportController],
  providers: [DiciplinaryReportService],
})
export class DiciplinaryReportModule {}
