import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UpdateLardoStudentNotificationDto } from './dto/update-lardo-student-notification.dto';
import { UpdateLardoStudentForFacultyNotificationDto } from './dto/update-lardo-student-for-faculty-notification.dto';
import { UpdateAtRiskStudentNotificationDto } from './dto/update-at-risk-student-notification.dto';
import { UpdateAtRiskStudentForFacultyNotificationDto } from './dto/update-at-risk-student-for-faculty-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Get('getLardoStudent/:id')
  getLardoStudent(@Param('id') id: string) {
    return this.notificationService.getLardoStudent(+id);
  }

  @Get('getLardoStudentForFaculty/:id')
  getLardoStudentForFaculty(@Param('id') id: string) {
    return this.notificationService.getLardoStudentForFaculty(+id);
  }


  @Get('getAtRiskStudent/:id')
  getAtRiskStudent(@Param('id') id: string) {
    return this.notificationService.getAtRiskStudent(+id);
  }

  @Get('getAtRiskStudentForFaculty/:id')
  getAtRiskStudentForFaculty(@Param('id') id: string) {
    return this.notificationService.getAtRiskStudentForFaculty(+id);
  }



      @Get('getParentNotification/:id')
  getParentNotification(@Param('id') id: string) {
    return this.notificationService.getParentNotification(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Patch('updateLardoAdviser/:id')
  updateLardoAdviser(@Param('id') id: string, @Body() updateLardoStudentNotificationDto: UpdateLardoStudentNotificationDto) {
    return this.notificationService.updateLardoAdviser(+id, updateLardoStudentNotificationDto);
  }

  @Patch('updateLardoFaculty/:id')
  updateLardoFaculty(@Param('id') id: string, @Body() updateLardoStudentForFacultyNotificationDto: UpdateLardoStudentForFacultyNotificationDto) {
    return this.notificationService.updateLardoFaculty(+id, updateLardoStudentForFacultyNotificationDto);
  }

    @Patch('updateAtRiskAdviser/:id')
  updateAtRiskAdviser(@Param('id') id: string, @Body() updateAtRiskStudentNotificationDto: UpdateAtRiskStudentNotificationDto) {
    return this.notificationService.updateAtRiskAdviser(+id, updateAtRiskStudentNotificationDto);
  }

      @Patch('updateAtRiskFaculty/:id')
  updateAtRiskFaculty(@Param('id') id: string, @Body() updateAtRiskStudentForFacultyNotificationDto: UpdateAtRiskStudentForFacultyNotificationDto) {
    return this.notificationService.updateAtRiskFaculty(+id, updateAtRiskStudentForFacultyNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
