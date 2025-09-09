import { Controller, Get, Post, Body, Patch, Param, Delete,Headers } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { CreateTeacherSubjectDto } from './dto/create-teacher-subject.dto';
import { currentUser } from 'src/shared/jwtDecode';
import { CreateTeacherGradeLevelDto } from './dto/create-teacher-gradeLevel.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post('')
  create(
    @Body() createSubjectDto: CreateSubjectDto,
    @Headers() headers,
  ) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.subjectsService.create(createSubjectDto, curr_user);
  }

  @Post('addTeachersSubject')
  addTeachersSubject(@Body() createTeacherSubjectDto: CreateTeacherSubjectDto) {
    return this.subjectsService.addTeachersSubject(createTeacherSubjectDto);
  }

  @Post('addTeachers/Grade-Level')
  addTeachersGradeLevel(@Body() createTeacherGradeLevelDto: CreateTeacherGradeLevelDto) {
    return this.subjectsService.addTeachersGradeLevel(createTeacherGradeLevelDto);
  }

  @Get('getMySubjects')
  getMySubjects(
    @Headers() headers,
     ) {
        var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.subjectsService.getMySubjects(curr_user);
  }

  
  @Get('getAllSubjectSF2/:teacherID')
  getAllSubjectSF2(
   @Param('teacherID') teacherID: string,
     ) {
   
    return this.subjectsService.getAllSubjectSF2(+teacherID);
  }


  @Get('getMyClassRecord/:filter/:tab')
  getMyClassRecord(
    @Headers() headers,@Param('filter') filter: string,@Param('tab') tab: string
     ) {
        var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.subjectsService.getMyClassRecord(curr_user,+filter,+tab);
  }

    @Get('getAllFacultySF2/:filter/:teacherID')
  getAllFacultySF2(
   @Param('filter') filter: string,@Param('teacherID') teacherID: string
     ) {
    return this.subjectsService.getAllFacultySF2(+filter,+teacherID);
  }

  @Get('getSubject/active/:gradeLevel')
  activeSubject(
    @Headers() headers,@Param('gradeLevel') gradeLevel: string,
     ) {
        var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.subjectsService.activeSubject(curr_user,gradeLevel);
  }

  @Get('getAllSubject/active')
  getAllSubject(
    @Headers() headers,
     ) {
        var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.subjectsService.getAllSubject(curr_user);
  }
  

  @Get('getFacultyList/:grade')
  getFacultyList(@Param('grade') grade: string) {
    return this.subjectsService.getFacultyList(grade);
  }

  @Get('getSubjectTaagged/:id')
  getSubjectTaagged(@Param('id') id: string) {
    return this.subjectsService.getSubjectTaagged(+id);
  }

  @Get('getGradeTaagged/:id')
  getGradeTaagged(@Param('id') id: string) {
    return this.subjectsService.getGradeTaagged(+id);
  }

  @Get('getSpicificSubject/:id/:filter/:grade')
  getSpicificSubject(
    // @Headers() headers, 
    @Param('id') id: string,
    @Param('filter') filter: string,
    @Param('grade') grade: string) {
    // var head_str = headers.authorization;
    // const curr_user = currentUser(head_str);
    return this.subjectsService.getSpicificSubject(+id,+filter,grade);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto,) {
    return this.subjectsService.update(+id, updateSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(+id);
  }
}
