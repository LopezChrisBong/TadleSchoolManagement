import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiciplinaryReportService } from './diciplinary-report.service';
import { CreateDiciplinaryReportDto } from './dto/create-diciplinary-report.dto';
import { UpdateDiciplinaryReportDto } from './dto/update-diciplinary-report.dto';

@Controller('diciplinary-report')
export class DiciplinaryReportController {
  constructor(private readonly diciplinaryReportService: DiciplinaryReportService) {}

  @Post()
  create(@Body() createDiciplinaryReportDto: CreateDiciplinaryReportDto) {
    return this.diciplinaryReportService.create(createDiciplinaryReportDto);
  }

  @Get()
  findAll() {
    return this.diciplinaryReportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diciplinaryReportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiciplinaryReportDto: UpdateDiciplinaryReportDto) {
    return this.diciplinaryReportService.update(+id, updateDiciplinaryReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diciplinaryReportService.remove(+id);
  }
}
