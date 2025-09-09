import { PartialType } from '@nestjs/swagger';
import { CreateLardoStudentForFacultyNotificationDto } from './create-lardo-student-for-faculty-notification.dto';

export class UpdateLardoStudentForFacultyNotificationDto extends PartialType(CreateLardoStudentForFacultyNotificationDto) {}
