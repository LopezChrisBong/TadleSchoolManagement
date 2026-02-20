import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  StreamableFile,
  Response,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';
import { CreatePdfGeneratorDto } from './dto/create-pdf-generator.dto';
import { UpdatePdfGeneratorDto } from './dto/update-pdf-generator.dto';
import { SendNewEmailDto } from './dto/send-new-email.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { JWTAuthGuard } from 'src/auth/utils/jwt-auth-guard';

@ApiTags('PDF generator')
@Controller('pdf-generator')
export class PdfGeneratorController {
  constructor(private readonly pdfGeneratorService: PdfGeneratorService) {}

  @Get('/getMySchedule/:facultyId/:filter')
  async getMySchedule(
    @Res() res,
    @Param('facultyId') facultyId: number,
    @Param('filter') filter: number,
  ): Promise<void> {
    const buffer = await this.pdfGeneratorService.getMySchedule(
      facultyId,
      filter,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);

    // console.log(n)
  }

  @Get('/getStudentAchievements/:studentID/:roomID/:filter/:gradeLevel')
  async getStudentAchievements(
    @Res() res,
    @Param('studentID') studentID: number,
    @Param('roomID') roomID: number,
    @Param('filter') filter: number,
    @Param('gradeLevel') gradeLevel: string,
  ): Promise<void> {
    const buffer = await this.pdfGeneratorService.getStudentAchievements(
      studentID,
      roomID,
      filter,
      gradeLevel,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);
  }

  @Get(
    '/getAllStudentsFinalGrade/:filter/:roomID/:quarter/:semester/:gradeLevel',
  )
  async getAllStudentsFinalGrade(
    @Res() res,

    @Param('filter') filter: number,
    @Param('roomID') roomID: number,
    @Param('quarter') quarter: string,
    @Param('semester') semester: string,
    @Param('gradeLevel') gradeLevel: string,
  ): Promise<void> {
    const buffer = await this.pdfGeneratorService.getAllStudentsFinalGrade(
      filter,
      roomID,
      quarter,
      semester,
      gradeLevel,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);
  }

  @Get('/getAllUnderLoadFaculty/:filter')
  async getAllUnderLoadFaculty(
    @Res() res,

    @Param('filter') filter: number,
  ): Promise<void> {
    const buffer =
      await this.pdfGeneratorService.getAllUnderLoadFaculty(filter);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);
  }

  @Get('/getSchoolForm2/:filter/:roomID/:subjectID/:date/:teacherID')
  async getSchoolForm2(
    @Res() res,
    @Param('filter') filter: number,
    @Param('roomID') roomID: number,
    @Param('subjectID') subjectID: string,
    @Param('date') date: string,
    @Param('teacherID') teacherID: number,
  ): Promise<void> {
    const buffer = await this.pdfGeneratorService.getSchoolForm2(
      filter,
      roomID,
      +subjectID,
      date,
      teacherID,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);
  }

  @Get('/getSchoolForm10/:filter/:teacherID')
  async getSchoolForm10(
    @Res() res,
    @Param('filter') filter: number,
    @Param('roomID') roomID: number,
    @Param('teacherID') teacherID: number,
  ): Promise<void> {
    const buffer = await this.pdfGeneratorService.getSchoolForm10(
      filter,
      teacherID,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);
  }

  @Get(
    '/getStudentSQuizes/:quarter/:semester/:roomID/:subjectID/:filter/:sub_subject/:id',
  )
  async getStudentSQuizes(
    @Res() res,
    @Param('quarter') quarter: string,
    @Param('semester') semester: string,
    @Param('roomID') roomID: string,
    @Param('subjectID') subjectID: string,
    @Param('filter') filter: string,
    @Param('sub_subject') sub_subject: string,
    @Param('id') id: string,
  ): Promise<void> {
    const buffer = await this.pdfGeneratorService.getStudentSQuizes(
      quarter,
      semester,
      +roomID,
      +subjectID,
      +filter,
      +sub_subject,
      +id,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);
  }

  @Get(
    '/getMAPEHQuizes/:quarter/:semester/:roomID/:subjectID/:filter/:sub_subject/:id',
  )
  async getMAPEHQuizes(
    @Res() res,
    @Param('quarter') quarter: string,
    @Param('semester') semester: string,
    @Param('roomID') roomID: string,
    @Param('subjectID') subjectID: string,
    @Param('filter') filter: string,
    @Param('sub_subject') sub_subject: string,
    @Param('id') id: string,
  ): Promise<void> {
    const buffer = await this.pdfGeneratorService.getMAPEHQuizes(
      quarter,
      semester,
      +roomID,
      +subjectID,
      +filter,
      +sub_subject,
      +id,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=example.pdf',
      'Content-Length': buffer.length,

      // prevent cache
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });

    res.end(buffer);
  }

  // @Get('getQRCode/:id')
  // async getQRCode(@Res() res, @Param('id') id: string): Promise<void> {
  //   const buffer = await this.pdfGeneratorService.getQRCode(id);

  //   res.set({
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': 'inline; filename=example.pdf',
  //     'Content-Length': buffer.length,

  //     // prevent cache
  //     'Cache-Control': 'no-cache, no-store, must-revalidate',
  //     Pragma: 'no-cache',
  //     Expires: 0,
  //   });

  //   res.end(buffer);

  //   // console.log(n)
  // }
}
