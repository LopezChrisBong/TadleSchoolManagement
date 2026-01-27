import {   
  Controller,
  Res,
  Headers,
  Request,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  HttpStatus,
  Query,} from '@nestjs/common';
import { EnrollStudentService } from './enroll-student.service';
import { CreateEnrollStudentDto } from './dto/create-enroll-student.dto';
import { UpdateEnrollStudentDto } from './dto/update-enroll-student.dto';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAddStrandDto } from 'src/rooms-section/dto/update-add-strand.dto';
import { currentUser } from 'src/shared/jwtDecode';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { CreateSchoolYearDto } from './dto/create-school-year.dto';
import { UpdateSchoolYearDto } from './dto/update-school-year.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Helper } from 'src/shared/helper';
import { createReadStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs';
import { CreateStudentValuesDto } from './dto/create-student-values.dto';
import { UpdateStudentValuesDto } from './dto/update-student-values.dto';
import { CreateImportStudentDto } from './dto/create-import-student.dto';

@Controller('enroll-student')
export class EnrollStudentController {
  constructor(private readonly enrollStudentService: EnrollStudentService) {}

  // @UseGuards(JWTAuthGuard)
  // @ApiBearerAuth()
  @Post()
  create(@Body() createEnrollStudentDto: CreateEnrollStudentDto) {
    return this.enrollStudentService.create(createEnrollStudentDto);
  }

  
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Post('importStudent')
  importStudent(@Body() createImportStudentDto: CreateImportStudentDto) {
    return this.enrollStudentService.importStudent(createImportStudentDto);
  }

    @Post('studentValues')
  studentValues(@Body() createStudentValuesDto: CreateStudentValuesDto) {
    return this.enrollStudentService.studentValues(createStudentValuesDto);
  }


  @Post('/enrollStudentWithFile')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: Helper.student_files,
        filename: Helper.customFileName,
      }),
    }),
  )
  enrollStudentWithFile(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Request() request,
  ) {
    console.log(files);
    console.log(JSON.parse(request.body.body));
    const bodystring = JSON.parse(request.body.body);
    return this.enrollStudentService.enrollStudentWithFile(bodystring, files);
  }


  @Post('/update-student-file')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: Helper.student_files,
        filename: Helper.customFileName,
      }),
    }),
  )
  async update_student_file(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
    @Request() request,
  ) {
    const bodystring = JSON.parse(request.body.body);
    return this.enrollStudentService.update_student_file(bodystring, files);
  }

  @Post('getArrayFile')
  async getArrayFile(@Body() deleteFileArray: any) {
    console.log(deleteFileArray);
    let fileToDelete = deleteFileArray;
    for (let index = 0; index < fileToDelete.length; index++) {
      const element = fileToDelete[index];
      await this.deleteFile(element);
    }
  }

  @Delete('deleteApplicantsFile/:fileName')
  async deleteFile(@Param('fileName') fileName: string) {
    // fs.unlink('student_file/'+fileName,
    fs.unlink('/../student_file/' + fileName, 
      (err) => {
      if (err) {
        console.error(err);
        return err;
      }
      console.log('Deleted File');
    });
  }


  @Post('AddSchedule')
  AddSchedule(@Body() createAvailabilityDto: CreateAvailabilityDto) {
    return this.enrollStudentService.AddSchedule(createAvailabilityDto);
  }

    // @UseGuards(JWTAuthGuard)
  // @ApiBearerAuth()
  @Post('updateEnrolledStudent')
  updateEnrolledStudent(@Body() updateVS: UpdateEnrollStudentDto) {
    return this.enrollStudentService.updateEnrolledStudent(updateVS);
  }




  

  @Post('addSchoolYear')
  addSchoolYear(@Body() createSchoolYearDto: CreateSchoolYearDto) {
    return this.enrollStudentService.addSchoolYear(createSchoolYearDto);
  }



   // @UseGuards(JWTAuthGuard)
  // @ApiBearerAuth()
  @Get('EnrollStudent')
  EnrollStudent(
    @Headers() headers,
    ) {
     var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.enrollStudentService.EnrollStudent(curr_user);
  }

  @Get('EnrolledStudent')
  EnrolledStudent(
    @Headers() headers,
  ) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.enrollStudentService.EnrolledStudent(curr_user);
  }

  @Get('AddClassStudent/EnrolledStudent/:grade/:filter')
  AddClassStudent(@Param('grade') grade: string,@Param('filter') filter: string,) {
    return this.enrollStudentService.AddClassStudent(grade,+filter);
  }

  @Get('getTotalEnrolledStudent/:filter/:status')
  getTotalEnrolledStudent(@Param('filter') filter: string,@Param('status') status: string,) {
    return this.enrollStudentService.getTotalEnrolledStudent(+filter, +status);
  }


  @Get('FacultySchedule/:filter')
  FacultySchedule(@Param('filter') filter: string,
  @Headers() headers,
) {
  var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.enrollStudentService.FacultySchedule(+filter, curr_user);
  }

    @Get('getSchoolYear')
    getSchoolYear() {
    return this.enrollStudentService.getSchoolYear();
  }

  @Get('getSchoolYear/toGenerate/:grade/:filter')
  getSchoolYearGenerate(@Param('grade') grade: string,@Param('filter') filter: string,) {
  return this.enrollStudentService.getSchoolYearGenerate(grade,+filter);
}

  @Get('getValuesData/:filter/:studentID/:roomID/:quarter/:semester')
  getValuesData(@Param('filter') filter: string,@Param('studentID') studentID: string,@Param('roomID') roomID: string,@Param('quarter') quarter: string,@Param('semester') semester: string,) {
  return this.enrollStudentService.getValuesData(+filter,+studentID,+roomID,quarter,semester);
  }
 
    @Get('getAllStudentsFinalGrade/:filter/:roomID/:quarter/:semester')
  getAllStudentsFinalGrade(@Param('filter') filter: string,@Param('roomID') roomID: string,@Param('quarter') quarter: string,@Param('semester') semester: string,) {
  return this.enrollStudentService.getAllStudentsFinalGrade(+filter,+roomID,quarter,semester);
  }

  @Get('getAllValuesData/:filter/:studentID')
  getAllValuesData(@Param('filter') filter: string,@Param('studentID') studentID: string,) {
  return this.enrollStudentService.getAllValuesData(+filter,+studentID);
  }


  @Get('MySchedule/:filter')
  MySchedule(@Headers() headers,@Param('filter') filter: string,) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.enrollStudentService.MySchedule(curr_user,+filter);
  }

  @Get('getClassProgramm/:grade/:section/:filter')
  getMyCoreTime(@Param('grade') grade: string,@Param('section') section: string,@Param('filter') filter: string,) {
    return this.enrollStudentService.getClassProgramm(grade, +section,+filter);
  }


  @Get('view/studentFile/:data')
  getFile(
    @Param('data') data: string,
    @Res({ passthrough: true }) res,
  ): StreamableFile {
    let content_type = '';
    // console.log(data)
    let datasplited = data.split('.');
    if (datasplited[datasplited.length - 1] == 'jpeg') {
      content_type = 'image/jpeg';
    } else if (datasplited[datasplited.length - 1] == 'jpg') {
      content_type = 'image/jpg';
    } else if (datasplited[datasplited.length - 1] == 'png') {
      content_type = 'image/png';
    } else if (datasplited[datasplited.length - 1] == 'pdf') {
      content_type = 'application/pdf';
    } else if (datasplited[datasplited.length - 1] == 'mp4') {
      content_type = 'video/mp4';
    } else if (datasplited[datasplited.length - 1] == 'avi') {
      content_type = 'video/x-msvideo';
    } else if (datasplited[datasplited.length - 1] == 'mov') {
      content_type = 'video/quicktime';
    } else if (datasplited[datasplited.length - 1] == 'wmv') {
      content_type = 'video/x-ms-wmv';
    } else if (datasplited[datasplited.length - 1] == '3gp') {
      content_type = 'video/3gpp';
    } else if (datasplited[datasplited.length - 1] == 'flv') {
      content_type = 'video/x-flv';
    } else if (datasplited[datasplited.length - 1] == 'doc') {
      content_type = 'application/msword';
    }

    const file = createReadStream(
      join(process.cwd(), process.env.FILE_PATH+'student_file/'+data),
      // join(process.cwd(), '/../student_file/' + data),
    );
    res.set({
      'Content-Type': content_type,
    });
    return new StreamableFile(file);
  }



  @Patch('updateClassProgram/:id')
  update(
    @Param('id') id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
    @Headers() headers,
  ) {
    var head_str = headers.authorization;
    const curr_user = currentUser(head_str);
    return this.enrollStudentService.updateClassProgram(+id, updateAvailabilityDto, curr_user);
  }

  @Patch('updateDropStudent/:id')
  updateDropStudent(@Param('id') id: string,@Body() updateEnrollStudentDto: UpdateEnrollStudentDto) {
    return this.enrollStudentService.updateDropStudent(+id,updateEnrollStudentDto);
  }

    @Patch('updateStudentValues/:id')
  updateStudentValues(@Param('id') id: string,@Body() updateStudentValuesDto: UpdateStudentValuesDto) {
    return this.enrollStudentService.updateStudentValues(+id,updateStudentValuesDto);
  }

  
  @Patch('updateSchoolYear/:id')
  updateSchoolYear(
    @Param('id') id: string,
    @Body() updateSchoolYearDto: UpdateSchoolYearDto,
    // @Headers() headers,
  ) {
    // var head_str = headers.authorization;
    // const curr_user = currentUser(head_str);
    return this.enrollStudentService.updateSchoolYear(+id, updateSchoolYearDto);
  }




  @Delete('deleteAvailabilitySchedule/:id')
  remove(@Param('id') id: string) {
    return this.enrollStudentService.remove(+id);
  }

}
