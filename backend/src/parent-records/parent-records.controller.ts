import { Headers,Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParentRecordsService } from './parent-records.service';
import { CreateParentRecordDto } from './dto/create-parent-record.dto';
import { UpdateParentRecordDto } from './dto/update-parent-record.dto';
import { currentUser } from 'src/shared/jwtDecode';
import { CreateStudentReportDisciplinaryDto } from './dto/create-student-report-disciplinary.dto';
import { UpdateStudentReportDiscipilinarydDto } from './dto/update-student-report-disciplinary.dto';
@Controller('parent-records')
export class ParentRecordsController {
  constructor(private readonly parentRecordsService: ParentRecordsService) {}

  @Post()
  create(@Body() createParentRecordDto: CreateParentRecordDto) {
    return this.parentRecordsService.create(createParentRecordDto);
  }

  @Post('studentReport')
  studentReport(@Body() createStudentReportDisciplinaryDto: CreateStudentReportDisciplinaryDto) {
    return this.parentRecordsService.studentReport(createStudentReportDisciplinaryDto);
  }

  @Get()
  findAll() {
    return this.parentRecordsService.findAll();
  }

  @Get('getMyChildrenList')
  getMyChildrenList( @Headers() headers,){
       var head_str = headers.authorization;
      const curr_user = currentUser(head_str);
      return this.parentRecordsService.getMyChildrenList(curr_user);
  }

  @Get('getMyChildrenAttendance/:studentID/:filter')
  getMyChildrenAttendance(@Param('studentID') studentID: string,@Param('filter') filter: string) {
    return this.parentRecordsService.getMyChildrenAttendance(+studentID,+filter);
  }


  @Get('getMyChildrenGrades/:studentID/:filter/:gradeLevel')
  getMyChildrenGrades(@Param('studentID') studentID: string,@Param('filter') filter: string,@Param('gradeLevel') gradeLevel: string) {
    return this.parentRecordsService.getMyChildrenGrades(+studentID,+filter,gradeLevel);
  }

    @Get('getDisciplinaryReport/:filter/:tab/:teacherID')
  getDisciplinaryReport(@Param('filter') filter: string,@Param('tab') tab: string,@Param('teacherID') teacherID: string) {
    return this.parentRecordsService.getDisciplinaryReport(+filter,+tab,+teacherID);
  }

      @Get('getPrefectReport/:filter/:tab/:roleID')
  getPrefectReport(@Param('filter') filter: string,@Param('tab') tab: string,@Param('roleID') roleID: string) {
    return this.parentRecordsService.getPrefectReport(+filter,+tab,+roleID);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentRecordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParentRecordDto: UpdateParentRecordDto) {
    return this.parentRecordsService.update(+id, updateParentRecordDto);
  }

  @Patch('updateStudentReport/:id')
  updateStudentReport(@Param('id') id: string, @Body() updateStudentReportDiscipilinarydDto:UpdateStudentReportDiscipilinarydDto) {
    return this.parentRecordsService.updateStudentReport(+id, updateStudentReportDiscipilinarydDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentRecordsService.remove(+id);
  }
}
