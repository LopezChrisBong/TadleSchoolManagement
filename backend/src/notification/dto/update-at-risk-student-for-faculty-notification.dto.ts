import { PartialType } from '@nestjs/swagger';
import { CreateAtRiskStudentForFacultyNotificationDto } from './create-at-risk-student-for-faculty-notification.dto';

export class UpdateAtRiskStudentForFacultyNotificationDto extends PartialType(CreateAtRiskStudentForFacultyNotificationDto) {}
