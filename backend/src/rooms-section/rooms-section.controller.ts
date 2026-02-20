import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoomsSectionService } from './rooms-section.service';
import { CreateRoomsSectionDto } from './dto/create-rooms-section.dto';
import { UpdateRoomsSectionDto } from './dto/update-rooms-section.dto';
import { CreateAddTrackDto } from './dto/create-add-track.dto';
import { UpdateAddTrackDto } from './dto/update-add-track.dto';
import { CreateAddStrandDto } from './dto/create-add-strand.dto';
import { UpdateAddStrandDto } from './dto/update-add-strand.dto';
import { CreateStudentListDto } from './dto/create-student-list.dto';
import { CreateAddStudentRoomDto } from './dto/create-add-student-room.dto';
import { CreateStudentAttendanceDto } from './dto/create-student-attendance.dto';
import { CreateStudentGradeDto } from './dto/create-student-grade.dto';
import { UpdateStudentAttendanceDto } from './dto/update-student-attendance.dto';
import { CreateTransmutedGradeDto } from './dto/create-transmuted-grade.dto';
import { UpdateTransmutedGradeDto } from './dto/update-transmuted-grade.dto';
import { CreateStudentQuarterFinalGradeDto } from './dto/create-student-quarter-final-grade.dto';
import { UpdateStudentGradeDto } from './dto/update-student-grade.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('rooms-section')
export class RoomsSectionController {
  constructor(private readonly roomsSectionService: RoomsSectionService) {}

  @Post()
  create(@Body() createRoomsSectionDto: CreateRoomsSectionDto) {
    return this.roomsSectionService.create(createRoomsSectionDto);
  }

  @Post('studentAttendance')
  studentAttendance(
    @Body() createStudentAttendanceDto: CreateStudentAttendanceDto,
  ) {
    return this.roomsSectionService.studentAttendance(
      createStudentAttendanceDto,
    );
  }

  @Post('quarterFinalGrade')
  quarterFinalGrade(
    @Body()
    createStudentQuarterFinalGradeDto: CreateStudentQuarterFinalGradeDto,
  ) {
    return this.roomsSectionService.quarterFinalGrade(
      createStudentQuarterFinalGradeDto,
    );
  }

  @Post('studentGrade')
  studentGrade(@Body() createStudentGradeDto: CreateStudentGradeDto) {
    return this.roomsSectionService.studentGrade(createStudentGradeDto);
  }

  @Post('addTrack')
  addTrack(@Body() createAddTrackDto: CreateAddTrackDto) {
    return this.roomsSectionService.addTrack(createAddTrackDto);
  }

  @Post('transmutedGrade')
  transmutedGrade(@Body() createTransmutedGradeDto: CreateTransmutedGradeDto) {
    return this.roomsSectionService.transmutedGrade(createTransmutedGradeDto);
  }

  @Post('addStrand')
  addStrand(@Body() createAddStrandDto: CreateAddStrandDto) {
    return this.roomsSectionService.addStrand(createAddStrandDto);
  }

  @Post('generateClassRecord/byGrade/level/:grade/:filter')
  generateClassRecord(
    @Param('grade') grade: string,
    @Param('filter') filter: string,
  ) {
    return this.roomsSectionService.generateClassRecord(grade, +filter);
  }

  @Post('genStrandRecord/seniorHigh/:grade/:filter/:strand')
  genStrandRecord(
    @Param('grade') grade: string,
    @Param('filter') filter: string,
    @Param('strand') strand: string,
  ) {
    return this.roomsSectionService.genStrandRecord(grade, +filter, +strand);
  }

  @Post('updateAddRecords/:grade/:sy/:room')
  updateAddRecords(
    @Body() createStudentListDto: CreateStudentListDto,
    @Param('grade') grade: string,
    @Param('sy') sy: string,
    @Param('room') room: string,
  ) {
    return this.roomsSectionService.updateAddRecords(
      createStudentListDto,
      grade,
      +sy,
      +room,
    );
  }

  @Post('addMyStudentClassRoom')
  addMyStudentClassRoom(
    @Body() createAddStudentRoomDto: CreateAddStudentRoomDto,
  ) {
    return this.roomsSectionService.addMyStudentClassRoom(
      createAddStudentRoomDto,
    );
  }
  @Post('addStudentClassRoom')
  addStudentClassRoom(
    @Body() createAddStudentRoomDto: CreateAddStudentRoomDto,
  ) {
    return this.roomsSectionService.addStudentClassRoom(
      createAddStudentRoomDto,
    );
  }

  @Get('getMyAdvisorySection/:facultyID')
  getMyAdvisorySection(@Param('facultyID') facultyID: string) {
    return this.roomsSectionService.getMyAdvisorySection(+facultyID);
  }

  @Get(':gradeLevel')
  findAll(@Param('gradeLevel') gradeLevel: string) {
    return this.roomsSectionService.findAll(gradeLevel);
  }

  @Get('getAllAttendanceByDate/:date/:roomID/:subjectID')
  getAllAttendanceByDate(
    @Param('date') date: string,
    @Param('roomID') roomID: string,
    @Param('subjectID') subjectID: string,
  ) {
    return this.roomsSectionService.getAllAttendanceByDate(
      date,
      +roomID,
      +subjectID,
    );
  }

  @Get(
    'getAllGradeByQuarter/:quarter/:semester/:roomID/:subjectID/:type/:filter/:sub_subject',
  )
  getAllGradeByQuarter(
    @Param('quarter') quarter: string,
    @Param('semester') semester: string,
    @Param('roomID') roomID: string,
    @Param('subjectID') subjectID: string,
    @Param('type') type: string,
    @Param('filter') filter: string,
    @Param('sub_subject') sub_subject: string,
  ) {
    return this.roomsSectionService.getAllGradeByQuarter(
      quarter,
      semester,
      +roomID,
      +subjectID,
      +type,
      +filter,
      +sub_subject,
    );
  }

  @Get('getAllAttendanceWholeSemester/:roomID/:subjectID/:filter')
  getAllAttendanceWholeSemester(
    @Param('roomID') roomID: string,
    @Param('subjectID') subjectID: string,
    @Param('filter') filter: string,
  ) {
    return this.roomsSectionService.getAllAttendanceWholeSemester(
      +roomID,
      +subjectID,
      +filter,
    );
  }

  @Get('conflictDayTime/:teacherID/:subjectID/:timeFrom/:timeTo/:days')
  conflictDayTime(
    @Param('teacherID') teacherID: string,
    @Param('subjectID') subjectID: string,
    @Param('timeFrom') timeFrom: string,
    @Param('timeTo') timeTo: string,
    @Param('days') days: string,
  ) {
    return this.roomsSectionService.conflictDayTime(
      +teacherID,
      +subjectID,
      timeFrom,
      timeTo,
      days,
    );
  }

  @Get(':gradeLevel/:section')
  findSectionName(
    @Param('gradeLevel') gradeLevel: string,
    @Param('section') section: string,
  ) {
    return this.roomsSectionService.findSectionName(gradeLevel, +section);
  }

  @Get('getAlltracks/Data/tracks')
  getAlltracks() {
    return this.roomsSectionService.getAlltracks();
  }

  @Get('getTransmutedGrade/grades/data')
  getTransmutedGrade() {
    return this.roomsSectionService.getTransmutedGrade();
  }

  @Get('getCountGen/:grade/:filter')
  getCountGen(@Param('grade') grade: string, @Param('filter') filter: string) {
    return this.roomsSectionService.getCountGen(grade, +filter);
  }

  @Get('getConflictStrand/:grade/:filter/:strand')
  getConflictStrand(
    @Param('grade') grade: string,
    @Param('filter') filter: string,
    @Param('strand') strand: string,
  ) {
    return this.roomsSectionService.getConflictStrand(grade, +filter, +strand);
  }

  @Get('getConflictQuarterGrade/:semester/:filter/:quarter/:roomID/:subjectID')
  getConflictQuarterGrade(
    @Param('semester') semester: string,
    @Param('filter') filter: string,
    @Param('quarter') quarter: string,
    @Param('roomID') roomID: string,
    @Param('subjectID') subjectID: string,
  ) {
    return this.roomsSectionService.getConflictQuarterGrade(
      semester,
      +filter,
      quarter,
      +roomID,
      +subjectID,
    );
  }

  @Get('getRoomClassList/:id/:grade/:filter')
  getRoomClassList(
    @Param('id') id: string,
    @Param('grade') grade: string,
    @Param('filter') filter: string,
  ) {
    return this.roomsSectionService.getRoomClassList(+id, grade, +filter);
  }

  @Get('getMyClassList/:id/:filter')
  getMyClassList(@Param('id') id: string, @Param('filter') filter: string) {
    return this.roomsSectionService.getMyClassList(+id, +filter);
  }

  @Get('getMyStudentAttendance/:id/:filter/:roomID')
  getMyStudentAttendance(
    @Param('id') id: string,
    @Param('filter') filter: string,
    @Param('roomID') roomID: string,
  ) {
    return this.roomsSectionService.getMyStudentAttendance(
      +id,
      +filter,
      +roomID,
    );
  }

  @Get('getMyStudentClassRecords/:id/:filter/:roomID')
  getMyStudentClassRecords(
    @Param('id') id: string,
    @Param('filter') filter: string,
    @Param('roomID') roomID: string,
  ) {
    return this.roomsSectionService.getMyStudentClassRecords(
      +id,
      +filter,
      +roomID,
    );
  }

  @Get(
    'getGeneratedGrade/:roomID/:schoolyearID/:quarter/:semester/:subjectID/:sub_subject',
  )
  getGeneratedGrade(
    @Param('roomID') roomID: string,
    @Param('schoolyearID') schoolyearID: string,
    @Param('quarter') quarter: string,
    @Param('semester') semester: string,
    @Param('subjectID') subjectID: string,
    @Param('sub_subject') sub_subject: string,
  ) {
    return this.roomsSectionService.getGeneratedGrade(
      +roomID,
      +schoolyearID,
      quarter,
      semester,
      +subjectID,
      sub_subject,
    );
  }

  @Get('AllStrand/Data/strand')
  AllStrand() {
    return this.roomsSectionService.AllStrand();
  }

  @Get('AllStrand/Enroll/:id')
  AllStrandEnroll(@Param('id') id: string) {
    return this.roomsSectionService.AllStrandEnroll(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsSectionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomsSectionDto: UpdateRoomsSectionDto,
  ) {
    return this.roomsSectionService.update(+id, updateRoomsSectionDto);
  }

  @Patch('updateTrack/:id')
  updateTrack(
    @Param('id') id: string,
    @Body() updateAddTrackDto: UpdateAddTrackDto,
  ) {
    return this.roomsSectionService.updateTrack(+id, updateAddTrackDto);
  }

  @Patch('updateStrand/:id')
  updateStrand(
    @Param('id') id: string,
    @Body() updateAddStrandDto: UpdateAddStrandDto,
  ) {
    return this.roomsSectionService.updateStrand(+id, updateAddStrandDto);
  }

  @Patch('archieveStrand/:id')
  archieveStrand(@Param('id') id: string) {
    return this.roomsSectionService.archieveStrand(+id);
  }

  @Patch('updateTransmutedGrade/:id')
  updateTransmutedGrade(
    @Param('id') id: string,
    @Body() updateTransmutedGradeDto: UpdateTransmutedGradeDto,
  ) {
    return this.roomsSectionService.updateTransmutedGrade(
      +id,
      updateTransmutedGradeDto,
    );
  }

  @Patch('updateAttendance/:date')
  updateAttendance(
    @Param('date') date: string,
    @Body() updateStudentAttendanceDto: UpdateStudentAttendanceDto,
  ) {
    return this.roomsSectionService.updateAttendance(
      date,
      updateStudentAttendanceDto,
    );
  }

  @Patch('updateParentToView/:id')
  updateParentToView(
    @Param('id') id: string,
    @Body() updateStudentAttendanceDto: UpdateStudentAttendanceDto,
  ) {
    return this.roomsSectionService.updateParentToView(
      +id,
      updateStudentAttendanceDto,
    );
  }

  @Patch('updateStudentGrade/:id')
  updateStudentGrade(
    @Param('id') id: string,
    @Body() updateStudentGradeDto: UpdateStudentGradeDto,
  ) {
    return this.roomsSectionService.updateStudentGrade(
      +id,
      updateStudentGradeDto,
    );
  }

  @Delete('removeMyStudent/:id')
  removeMyStudent(@Param('id') id: string) {
    return this.roomsSectionService.removeMyStudent(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsSectionService.remove(+id);
  }
}
